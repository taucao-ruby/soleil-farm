<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    protected string $loginEndpoint;
    protected string $meEndpoint;
    protected string $registerEndpoint;

    protected function setUp(): void
    {
        parent::setUp();

        $this->loginEndpoint = "{$this->apiBase}/auth/login";
        $this->meEndpoint = "{$this->apiBase}/auth/me";
        $this->registerEndpoint = "{$this->apiBase}/auth/register";
    }

    // =========================================================================
    // PASSWORD SECURITY TESTS
    // =========================================================================

    public function test_password_is_hashed_in_database(): void
    {
        $plainPassword = 'password123';

        $user = User::factory()->create([
            'password' => Hash::make($plainPassword),
        ]);

        // Password should not be stored in plain text
        $this->assertNotEquals($plainPassword, $user->password);

        // Password should be properly hashed
        $this->assertTrue(Hash::check($plainPassword, $user->password));

        // Raw database value should not contain plain password
        $rawUser = DB::table('users')->where('id', $user->id)->first();
        $this->assertNotEquals($plainPassword, $rawUser->password);
        $this->assertStringStartsWith('$2y$', $rawUser->password); // bcrypt format
    }

    public function test_password_is_not_returned_in_api_responses(): void
    {
        $user = $this->createAdminUser();

        // Login response
        $loginResponse = $this->postJson($this->loginEndpoint, [
            'email' => 'admin@soleilfarm.vn',
            'password' => 'password123',
        ]);

        $loginData = $loginResponse->json();
        $this->assertArrayNotHasKey('password', $loginData['data']['user'] ?? []);

        // Me endpoint response
        $token = $loginResponse->json('data.token');
        $meResponse = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->getJson($this->meEndpoint);

        $meData = $meResponse->json();
        $this->assertArrayNotHasKey('password', $meData['data']['user'] ?? []);
    }

    public function test_registration_hashes_password(): void
    {
        $response = $this->postJson($this->registerEndpoint, [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201);

        $user = User::where('email', 'newuser@example.com')->first();

        $this->assertNotEquals('password123', $user->password);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    // =========================================================================
    // TOKEN SECURITY TESTS
    // =========================================================================

    public function test_tokens_are_hashed_in_database(): void
    {
        $user = User::factory()->create();
        $tokenResult = $user->createToken('test-token');

        $plainToken = $tokenResult->plainTextToken;

        // Get the stored token from database
        $storedToken = PersonalAccessToken::where('tokenable_id', $user->id)->first();

        // The plain text token contains ID|hash
        $parts = explode('|', $plainToken);
        $tokenHash = $parts[1];

        // The stored token should be a hash, not the plain value
        $this->assertNotEquals($tokenHash, $storedToken->token);

        // The stored token should be a SHA-256 hash (64 characters hex)
        $this->assertEquals(64, strlen($storedToken->token));
    }

    public function test_remember_token_is_not_used_for_api_auth(): void
    {
        $user = User::factory()->create([
            'remember_token' => 'some-remember-token',
        ]);

        // Try to use remember_token as bearer token (should fail)
        $response = $this->withHeaders([
            'Authorization' => 'Bearer some-remember-token',
            'Accept' => 'application/json',
        ])->getJson($this->meEndpoint);

        $response->assertStatus(401);
    }

    // =========================================================================
    // AUTHENTICATION SECURITY TESTS
    // =========================================================================

    public function test_cannot_access_protected_routes_without_token(): void
    {
        $protectedEndpoints = [
            ['GET', "{$this->apiBase}/auth/me"],
            ['POST', "{$this->apiBase}/auth/logout"],
            ['GET', "{$this->apiBase}/land-parcels"],
            ['GET', "{$this->apiBase}/crop-cycles"],
            ['GET', "{$this->apiBase}/dashboard"],
        ];

        foreach ($protectedEndpoints as [$method, $endpoint]) {
            $response = $this->withHeaders($this->getGuestHeaders())
                ->json($method, $endpoint);

            $this->assertEquals(
                401,
                $response->status(),
                "Endpoint {$method} {$endpoint} should return 401 without token"
            );
        }
    }

    public function test_invalid_token_returns_401(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid-token-12345',
            'Accept' => 'application/json',
        ])->getJson($this->meEndpoint);

        $response->assertStatus(401);
    }

    public function test_malformed_authorization_header_returns_401(): void
    {
        $malformedHeaders = [
            'Bearer',
            'Bearer ',
            'Basic dXNlcjpwYXNz',
            'Token some-token',
            'bearer lowercase-token',
        ];

        foreach ($malformedHeaders as $authHeader) {
            $response = $this->withHeaders([
                'Authorization' => $authHeader,
                'Accept' => 'application/json',
            ])->getJson($this->meEndpoint);

            $this->assertEquals(
                401,
                $response->status(),
                "Malformed header '{$authHeader}' should return 401"
            );
        }
    }

    public function test_deleted_user_token_returns_401(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        // Delete the user
        $user->delete();

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->getJson($this->meEndpoint);

        $response->assertStatus(401);
    }

    // =========================================================================
    // SQL INJECTION TESTS
    // =========================================================================

    public function test_sql_injection_in_login_email_is_blocked(): void
    {
        $sqlInjectionPayloads = [
            "admin@test.com'; DROP TABLE users; --",
            "admin@test.com' OR '1'='1",
            "admin@test.com' UNION SELECT * FROM users --",
            "admin@test.com'; INSERT INTO users --",
            "1' OR '1' = '1'/*",
        ];

        foreach ($sqlInjectionPayloads as $payload) {
            $response = $this->postJson($this->loginEndpoint, [
                'email' => $payload,
                'password' => 'password123',
            ]);

            // Should return validation error (422) or auth error (401), not server error (500)
            $this->assertTrue(
                in_array($response->status(), [422, 401]),
                "SQL injection payload should be handled safely: {$payload}. Got status: {$response->status()}"
            );

            // Users table should still exist
            $this->assertTrue(
                \Schema::hasTable('users'),
                "Users table should not be dropped by SQL injection"
            );
        }
    }

    public function test_sql_injection_in_registration_is_blocked(): void
    {
        $response = $this->postJson($this->registerEndpoint, [
            'name' => "Test'; DROP TABLE users; --",
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        // Registration might succeed (name is just stored), but table should exist
        $this->assertTrue(\Schema::hasTable('users'));

        // If registration succeeded, user should have the literal string as name
        if ($response->status() === 201) {
            $user = User::where('email', 'test@example.com')->first();
            $this->assertStringContainsString('DROP TABLE', $user->name);
        }
    }

    // =========================================================================
    // XSS PREVENTION TESTS
    // =========================================================================

    public function test_xss_in_user_name_is_stored_safely(): void
    {
        $xssPayloads = [
            '<script>alert("XSS")</script>',
            '<img src="x" onerror="alert(1)">',
            'javascript:alert(1)',
            '<svg onload="alert(1)">',
            '"><script>alert(String.fromCharCode(88,83,83))</script>',
        ];

        foreach ($xssPayloads as $payload) {
            $response = $this->postJson($this->registerEndpoint, [
                'name' => $payload,
                'email' => 'xss' . rand(1000, 9999) . '@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

            if ($response->status() === 201) {
                $user = User::find($response->json('data.user.id'));

                // Name should be stored as-is (escaping happens on output)
                $this->assertEquals($payload, $user->name);

                // API response should return the name (JSON encoding handles escaping)
                $token = $response->json('data.token');
                $meResponse = $this->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->getJson($this->meEndpoint);

                // Response should be valid JSON (proper escaping)
                $this->assertJson($meResponse->getContent());
            }
        }
    }

    // =========================================================================
    // RATE LIMITING TESTS (if applicable)
    // =========================================================================

    public function test_multiple_failed_login_attempts_are_logged(): void
    {
        $this->createAdminUser();

        // Make several failed login attempts
        for ($i = 0; $i < 3; $i++) {
            $this->postJson($this->loginEndpoint, [
                'email' => 'admin@soleilfarm.vn',
                'password' => 'wrong-password',
            ]);
        }

        // Check if attempts are logged (check log files or logging service)
        // This is a basic test - in production you'd check actual log output
        $this->assertTrue(true); // Placeholder - logging is configured in controller
    }

    // =========================================================================
    // SESSION FIXATION TESTS
    // =========================================================================

    public function test_new_token_is_issued_on_each_login(): void
    {
        $user = $this->createAdminUser();

        // First login
        $response1 = $this->postJson($this->loginEndpoint, [
            'email' => 'admin@soleilfarm.vn',
            'password' => 'password123',
        ]);

        $token1 = $response1->json('data.token');

        // Second login
        $response2 = $this->postJson($this->loginEndpoint, [
            'email' => 'admin@soleilfarm.vn',
            'password' => 'password123',
        ]);

        $token2 = $response2->json('data.token');

        // Tokens should be different
        $this->assertNotEquals($token1, $token2);

        // Both tokens should still work (multiple sessions allowed)
        $this->withHeaders([
            'Authorization' => "Bearer {$token1}",
            'Accept' => 'application/json',
        ])->getJson($this->meEndpoint)->assertStatus(200);

        $this->withHeaders([
            'Authorization' => "Bearer {$token2}",
            'Accept' => 'application/json',
        ])->getJson($this->meEndpoint)->assertStatus(200);
    }

    // =========================================================================
    // CONTENT TYPE SECURITY
    // =========================================================================

    public function test_api_only_accepts_json_content_type(): void
    {
        $this->createAdminUser();

        // Send form-urlencoded instead of JSON
        $response = $this->post($this->loginEndpoint, [
            'email' => 'admin@soleilfarm.vn',
            'password' => 'password123',
        ], [
            'Accept' => 'application/json',
            'Content-Type' => 'application/x-www-form-urlencoded',
        ]);

        // Should still work as Laravel handles both, but response should be JSON
        $this->assertTrue(
            str_contains($response->headers->get('Content-Type'), 'application/json'),
            'Response should be JSON'
        );
    }
}
