<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    // =========================================================================
    // PROTECTED RESOURCE ACCESS TESTS
    // =========================================================================

    public function test_authenticated_user_can_access_land_parcels(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->getJson("{$this->apiBase}/land-parcels");

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_authenticated_user_can_access_crop_cycles(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->getJson("{$this->apiBase}/crop-cycles");

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_authenticated_user_can_access_activity_logs(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->getJson("{$this->apiBase}/activity-logs");

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_authenticated_user_can_access_dashboard(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->getJson("{$this->apiBase}/dashboard");

        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_access_water_sources(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->getJson("{$this->apiBase}/water-sources");

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_authenticated_user_can_access_crop_types(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->getJson("{$this->apiBase}/crop-types");

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_authenticated_user_can_access_seasons(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->getJson("{$this->apiBase}/seasons");

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_authenticated_user_can_access_units_of_measure(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->getJson("{$this->apiBase}/units-of-measure");

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    // =========================================================================
    // UNAUTHENTICATED ACCESS TESTS
    // =========================================================================

    public function test_unauthenticated_user_cannot_access_land_parcels(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->getJson("{$this->apiBase}/land-parcels");

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_access_crop_cycles(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->getJson("{$this->apiBase}/crop-cycles");

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_access_activity_logs(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->getJson("{$this->apiBase}/activity-logs");

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_access_dashboard(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->getJson("{$this->apiBase}/dashboard");

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_access_water_sources(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->getJson("{$this->apiBase}/water-sources");

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_create_land_parcel(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->postJson("{$this->apiBase}/land-parcels", [
                'name' => 'Test Parcel',
                'code' => 'TEST-01',
            ]);

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_create_activity_log(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->postJson("{$this->apiBase}/activity-logs", [
                'activity_type_id' => 1,
                'performed_at' => now()->toDateTimeString(),
            ]);

        $response->assertStatus(401);
    }

    // =========================================================================
    // INVALID TOKEN ACCESS TESTS
    // =========================================================================

    public function test_invalid_token_cannot_access_protected_resources(): void
    {
        $endpoints = [
            ['GET', "{$this->apiBase}/land-parcels"],
            ['GET', "{$this->apiBase}/crop-cycles"],
            ['GET', "{$this->apiBase}/activity-logs"],
            ['GET', "{$this->apiBase}/dashboard"],
            ['GET', "{$this->apiBase}/water-sources"],
            ['GET', "{$this->apiBase}/crop-types"],
            ['GET', "{$this->apiBase}/seasons"],
        ];

        foreach ($endpoints as [$method, $endpoint]) {
            $response = $this->withHeaders($this->getInvalidAuthHeaders())
                ->json($method, $endpoint);

            $this->assertEquals(
                401,
                $response->status(),
                "Endpoint {$method} {$endpoint} should return 401 with invalid token"
            );
        }
    }

    public function test_expired_token_cannot_access_resources(): void
    {
        $user = User::factory()->create();

        // Create token with past expiration
        $token = $user->createToken('test', ['*'], now()->subDay());
        $plainToken = $token->plainTextToken;

        // Manually update the token to be expired
        $token->accessToken->update([
            'expires_at' => now()->subHour(),
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$plainToken}",
            'Accept' => 'application/json',
        ])->getJson("{$this->apiBase}/land-parcels");

        $response->assertStatus(401);
    }

    // =========================================================================
    // WRITE OPERATIONS AUTHORIZATION
    // =========================================================================

    public function test_authenticated_user_can_create_land_parcel(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson("{$this->apiBase}/land-parcels", [
            'name' => 'Test Parcel',
            'code' => 'TEST-01',
            'land_type' => 'rice_field',
            'area_value' => 100,
            'area_unit_id' => 1,
        ]);

        // Should either succeed or fail validation, but not 401
        $this->assertNotEquals(401, $response->status());
    }

    public function test_authenticated_user_can_create_crop_cycle(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson("{$this->apiBase}/crop-cycles", [
            'name' => 'Test Cycle',
        ]);

        // Should either succeed or fail validation, but not 401
        $this->assertNotEquals(401, $response->status());
    }

    public function test_authenticated_user_can_create_activity_log(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson("{$this->apiBase}/activity-logs", [
            'activity_type_id' => 1,
            'performed_at' => now()->toDateTimeString(),
        ]);

        // Should either succeed or fail validation, but not 401
        $this->assertNotEquals(401, $response->status());
    }

    // =========================================================================
    // PUBLIC ENDPOINTS TESTS
    // =========================================================================

    public function test_login_endpoint_is_accessible_without_auth(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->postJson("{$this->apiBase}/auth/login", [
                'email' => 'test@example.com',
                'password' => 'password',
            ]);

        // Should return validation error, not 401
        $this->assertNotEquals(401, $response->status());
    }

    public function test_register_endpoint_is_accessible_without_auth(): void
    {
        $response = $this->withHeaders($this->getGuestHeaders())
            ->postJson("{$this->apiBase}/auth/register", [
                'name' => 'Test',
                'email' => 'test@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

        // Should succeed or fail validation, not 401
        $this->assertNotEquals(401, $response->status());
    }

    // =========================================================================
    // CROSS-USER ACCESS TESTS (Future multi-tenancy preparation)
    // =========================================================================

    public function test_user_token_is_tied_to_specific_user(): void
    {
        $user1 = User::factory()->create(['email' => 'user1@example.com']);
        $user2 = User::factory()->create(['email' => 'user2@example.com']);

        ['token' => $token1] = $this->createAuthenticatedUser($user1);

        // Use user1's token to access /me
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token1}",
            'Accept' => 'application/json',
        ])->getJson("{$this->apiBase}/auth/me");

        $response->assertStatus(200);

        // Should return user1's data, not user2's
        $this->assertEquals($user1->id, $response->json('data.user.id'));
        $this->assertEquals('user1@example.com', $response->json('data.user.email'));
    }

    public function test_different_users_have_different_tokens(): void
    {
        $user1 = User::factory()->create(['email' => 'user1@test.com']);
        $user2 = User::factory()->create(['email' => 'user2@test.com']);

        $token1 = $user1->createToken('token-1')->plainTextToken;
        $token2 = $user2->createToken('token-2')->plainTextToken;

        $this->assertNotEquals($token1, $token2);

        // Verify tokens are stored separately
        $this->assertEquals(1, $user1->tokens()->count());
        $this->assertEquals(1, $user2->tokens()->count());

        // Verify each token belongs to correct user
        $this->actingAsAuthenticatedUser($user1);
        $response1 = $this->getJson("{$this->apiBase}/auth/me");
        $this->assertEquals($user1->id, $response1->json('data.user.id'));

        $this->actingAsAuthenticatedUser($user2);
        $response2 = $this->getJson("{$this->apiBase}/auth/me");
        $this->assertEquals($user2->id, $response2->json('data.user.id'));
    }
}
