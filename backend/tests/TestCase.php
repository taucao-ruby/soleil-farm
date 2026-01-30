<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /**
     * The API base path
     */
    protected string $apiBase = '/api/v1';

    /**
     * Set up the test environment
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Seed required data for tests
        $this->seed(\Database\Seeders\UnitOfMeasureSeeder::class);
    }

    /**
     * Create a user and authenticate as them using Sanctum
     *
     * @param User|null $user
     * @param array $abilities Token abilities
     * @return $this
     */
    protected function actingAsAuthenticatedUser(?User $user = null, array $abilities = ['*']): static
    {
        $user = $user ?? User::factory()->create();
        Sanctum::actingAs($user, $abilities);

        return $this;
    }

    /**
     * Create a user and return them with a bearer token
     *
     * @param User|null $user
     * @param array $abilities Token abilities
     * @return array{user: User, token: string}
     */
    protected function createAuthenticatedUser(?User $user = null, array $abilities = ['*']): array
    {
        $user = $user ?? User::factory()->create();
        $token = $user->createToken('test-token', $abilities)->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Get authorization headers for a user
     *
     * @param User|null $user
     * @param array $abilities Token abilities
     * @return array
     */
    protected function getAuthHeaders(?User $user = null, array $abilities = ['*']): array
    {
        ['token' => $token] = $this->createAuthenticatedUser($user, $abilities);

        return [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ];
    }

    /**
     * Get headers with invalid/expired token
     *
     * @return array
     */
    protected function getInvalidAuthHeaders(): array
    {
        return [
            'Authorization' => 'Bearer invalid-token-that-does-not-exist',
            'Accept' => 'application/json',
        ];
    }

    /**
     * Get headers without authorization
     *
     * @return array
     */
    protected function getGuestHeaders(): array
    {
        return [
            'Accept' => 'application/json',
        ];
    }

    /**
     * Make authenticated JSON request
     *
     * @param string $method
     * @param string $uri
     * @param array $data
     * @param User|null $user
     * @return \Illuminate\Testing\TestResponse
     */
    protected function authJson(string $method, string $uri, array $data = [], ?User $user = null)
    {
        return $this->withHeaders($this->getAuthHeaders($user))
            ->json($method, $uri, $data);
    }

    /**
     * Login a user and return the token
     *
     * @param string $email
     * @param string $password
     * @return \Illuminate\Testing\TestResponse
     */
    protected function loginUser(string $email, string $password)
    {
        return $this->postJson("{$this->apiBase}/auth/login", [
            'email' => $email,
            'password' => $password,
        ]);
    }

    /**
     * Register a new user
     *
     * @param array $data
     * @return \Illuminate\Testing\TestResponse
     */
    protected function registerUser(array $data)
    {
        return $this->postJson("{$this->apiBase}/auth/register", $data);
    }

    /**
     * Create admin user with known credentials
     *
     * @return User
     */
    protected function createAdminUser(): User
    {
        return User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@soleilfarm.vn',
            'password' => bcrypt('password123'),
        ]);
    }

    /**
     * Assert JSON structure matches API standard response
     *
     * @param \Illuminate\Testing\TestResponse $response
     * @param array $dataStructure
     * @return void
     */
    protected function assertApiResponse($response, array $dataStructure = []): void
    {
        $structure = ['success'];

        if (!empty($dataStructure)) {
            $structure['data'] = $dataStructure;
        }

        $response->assertJsonStructure($structure);
    }
}
