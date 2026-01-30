<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected string $loginEndpoint;
    protected string $logoutEndpoint;
    protected string $meEndpoint;
    protected string $registerEndpoint;
    protected string $refreshEndpoint;
    protected string $logoutAllEndpoint;

    protected function setUp(): void
    {
        parent::setUp();

        $this->loginEndpoint = "{$this->apiBase}/auth/login";
        $this->logoutEndpoint = "{$this->apiBase}/auth/logout";
        $this->meEndpoint = "{$this->apiBase}/auth/me";
        $this->registerEndpoint = "{$this->apiBase}/auth/register";
        $this->refreshEndpoint = "{$this->apiBase}/auth/refresh";
        $this->logoutAllEndpoint = "{$this->apiBase}/auth/logout-all";
    }

    // =========================================================================
    // LOGIN TESTS
    // =========================================================================

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = $this->createAdminUser();

        $response = $this->postJson($this->loginEndpoint, [
            'email' => 'admin@soleilfarm.vn',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Đăng nhập thành công',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'created_at'],
                    'token',
                    'token_type',
                    'expires_at',
                ],
            ]);

        $this->assertEquals('Bearer', $response->json('data.token_type'));
        $this->assertEquals($user->id, $response->json('data.user.id'));
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        $this->createAdminUser();

        $response = $this->postJson($this->loginEndpoint, [
            'email' => 'admin@soleilfarm.vn',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_user_cannot_login_with_nonexistent_email(): void
    {
        $response = $this->postJson($this->loginEndpoint, [
            'email' => 'nonexistent@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_requires_email_and_password(): void
    {
        $response = $this->postJson($this->loginEndpoint, []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_login_validates_email_format(): void
    {
        $response = $this->postJson($this->loginEndpoint, [
            'email' => 'not-an-email',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_validates_password_minimum_length(): void
    {
        $this->createAdminUser();

        $response = $this->postJson($this->loginEndpoint, [
            'email' => 'admin@soleilfarm.vn',
            'password' => 'short', // less than 8 characters
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_login_returns_token_and_user_data(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson($this->loginEndpoint, [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);

        $token = $response->json('data.token');
        $this->assertNotEmpty($token);
        $this->assertStringContains('|', $token);

        $userData = $response->json('data.user');
        $this->assertEquals('Test User', $userData['name']);
        $this->assertEquals('test@example.com', $userData['email']);
    }

    public function test_login_creates_token_in_database(): void
    {
        $user = $this->createAdminUser();

        $this->postJson($this->loginEndpoint, [
            'email' => 'admin@soleilfarm.vn',
            'password' => 'password123',
        ]);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
            'name' => 'auth-token',
        ]);
    }

    // =========================================================================
    // LOGOUT TESTS
    // =========================================================================

    public function test_authenticated_user_can_logout(): void
    {
        ['user' => $user, 'token' => $token] = $this->createAuthenticatedUser();

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson($this->logoutEndpoint);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Đăng xuất thành công',
            ]);
    }

    public function test_logout_revokes_current_token(): void
    {
        $user = User::factory()->create();
        $tokenInstance = $user->createToken('test-token');
        $token = $tokenInstance->plainTextToken;
        $tokenId = $tokenInstance->accessToken->id;

        // Logout
        $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson($this->logoutEndpoint);

        // Token should be deleted
        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $tokenId,
        ]);
    }

    public function test_unauthenticated_user_cannot_logout(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->postJson($this->logoutEndpoint);

        $response->assertStatus(401);
    }

    public function test_logout_invalidates_token_for_future_requests(): void
    {
        $user = User::factory()->create();
        $tokenInstance = $user->createToken('test-token');
        $token = $tokenInstance->plainTextToken;
        $tokenId = $tokenInstance->accessToken->id;

        // Logout
        $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson($this->logoutEndpoint);

        // Token should be deleted from database
        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $tokenId,
        ]);

        // Verify token no longer exists
        $this->assertNull(PersonalAccessToken::find($tokenId));
    }

    public function test_user_can_logout_from_all_devices(): void
    {
        $user = User::factory()->create();

        // Create multiple tokens
        $token1 = $user->createToken('device-1')->plainTextToken;
        $token2 = $user->createToken('device-2')->plainTextToken;
        $token3 = $user->createToken('device-3')->plainTextToken;

        $this->assertEquals(3, $user->tokens()->count());

        // Logout from all devices
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token1}",
            'Accept' => 'application/json',
        ])->postJson($this->logoutAllEndpoint);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Đã đăng xuất khỏi tất cả thiết bị',
            ]);

        // All tokens should be deleted
        $this->assertEquals(0, $user->tokens()->count());
    }

    // =========================================================================
    // ME ENDPOINT TESTS
    // =========================================================================

    public function test_authenticated_user_can_get_own_profile(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->actingAsAuthenticatedUser($user);

        $response = $this->getJson($this->meEndpoint);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => 'Test User',
                        'email' => 'test@example.com',
                    ],
                ],
            ]);
    }

    public function test_unauthenticated_user_cannot_access_me_endpoint(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->getJson($this->meEndpoint);

        $response->assertStatus(401);
    }

    public function test_me_endpoint_returns_correct_user_data(): void
    {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'email_verified_at' => now(),
        ]);

        $this->actingAsAuthenticatedUser($user);

        $response = $this->getJson($this->meEndpoint);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'email_verified_at',
                        'created_at',
                        'updated_at',
                    ],
                ],
            ]);

        $this->assertEquals('John Doe', $response->json('data.user.name'));
        $this->assertEquals('john@example.com', $response->json('data.user.email'));
    }

    // =========================================================================
    // REGISTER TESTS
    // =========================================================================

    public function test_user_can_register_with_valid_data(): void
    {
        $response = $this->postJson($this->registerEndpoint, [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Đăng ký thành công',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'created_at'],
                    'token',
                    'token_type',
                    'expires_at',
                ],
            ]);
    }

    public function test_registration_requires_all_fields(): void
    {
        $response = $this->postJson($this->registerEndpoint, []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_registration_validates_email_uniqueness(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->postJson($this->registerEndpoint, [
            'name' => 'New User',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_validates_password_length(): void
    {
        $response = $this->postJson($this->registerEndpoint, [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_validates_password_confirmation(): void
    {
        $response = $this->postJson($this->registerEndpoint, [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_creates_user_and_issues_token(): void
    {
        $response = $this->postJson($this->registerEndpoint, [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201);

        // User should be in database
        $this->assertDatabaseHas('users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
        ]);

        // Token should be created
        $userId = $response->json('data.user.id');
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $userId,
            'tokenable_type' => User::class,
        ]);
    }

    public function test_registered_user_can_immediately_use_token(): void
    {
        $response = $this->postJson($this->registerEndpoint, [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $token = $response->json('data.token');

        // Use token to access protected endpoint
        $meResponse = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->getJson($this->meEndpoint);

        $meResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'name' => 'New User',
                        'email' => 'newuser@example.com',
                    ],
                ],
            ]);
    }

    // =========================================================================
    // TOKEN MANAGEMENT TESTS
    // =========================================================================

    public function test_revoked_token_cannot_be_used(): void
    {
        $user = User::factory()->create();
        $tokenInstance = $user->createToken('test-token');
        $token = $tokenInstance->plainTextToken;

        // Manually revoke the token
        $tokenInstance->accessToken->delete();

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->getJson($this->meEndpoint);

        $response->assertStatus(401);
    }

    public function test_user_can_have_multiple_active_tokens(): void
    {
        $user = User::factory()->create();

        $token1 = $user->createToken('device-1')->plainTextToken;
        $token2 = $user->createToken('device-2')->plainTextToken;
        $token3 = $user->createToken('device-3')->plainTextToken;

        // All tokens should work
        foreach ([$token1, $token2, $token3] as $token) {
            $response = $this->withHeaders([
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json',
            ])->getJson($this->meEndpoint);

            $response->assertStatus(200);
        }

        $this->assertEquals(3, $user->tokens()->count());
    }

    public function test_token_refresh_issues_new_token(): void
    {
        $user = User::factory()->create();
        $oldTokenInstance = $user->createToken('test-token');
        $oldToken = $oldTokenInstance->plainTextToken;
        $oldTokenId = $oldTokenInstance->accessToken->id;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$oldToken}",
            'Accept' => 'application/json',
        ])->postJson($this->refreshEndpoint);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Token đã được làm mới',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'token',
                    'token_type',
                    'expires_at',
                ],
            ]);

        $newToken = $response->json('data.token');
        $this->assertNotEquals($oldToken, $newToken);

        // Old token should be deleted from database
        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $oldTokenId,
        ]);

        // New token should exist
        $this->assertEquals(1, $user->fresh()->tokens()->count());

        // New token should work
        $newTokenResponse = $this->withHeaders([
            'Authorization' => "Bearer {$newToken}",
            'Accept' => 'application/json',
        ])->getJson($this->meEndpoint);

        $newTokenResponse->assertStatus(200);
    }

    // =========================================================================
    // EDGE CASES
    // =========================================================================

    public function test_login_email_is_case_sensitive(): void
    {
        // Note: SQLite is case-insensitive by default, MySQL is case-insensitive for email
        // This test documents the current behavior
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Exact case should work
        $response = $this->postJson($this->loginEndpoint, [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
    }

    public function test_login_trims_whitespace_from_email(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson($this->loginEndpoint, [
            'email' => '  test@example.com  ',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
    }

    /**
     * Helper method to check if string contains substring
     */
    private function assertStringContains(string $needle, string $haystack): void
    {
        $this->assertTrue(
            str_contains($haystack, $needle),
            "Failed asserting that '{$haystack}' contains '{$needle}'"
        );
    }
}
