<?php

namespace Tests\Helpers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\TestResponse;

/**
 * Helper class for authentication-related test utilities
 */
class AuthHelper
{
    /**
     * API base path
     */
    private const API_BASE = '/api/v1';

    /**
     * Login a user and return the response
     *
     * @param string|null $email
     * @param string|null $password
     * @return TestResponse
     */
    public static function login(?string $email = null, ?string $password = null): TestResponse
    {
        return test()->postJson(self::API_BASE . '/auth/login', [
            'email' => $email ?? 'admin@soleilfarm.vn',
            'password' => $password ?? 'password123',
        ]);
    }

    /**
     * Login and return just the token
     *
     * @param string|null $email
     * @param string|null $password
     * @return string|null
     */
    public static function getToken(?string $email = null, ?string $password = null): ?string
    {
        $response = self::login($email, $password);

        if ($response->status() !== 200) {
            return null;
        }

        return $response->json('data.token');
    }

    /**
     * Create a new user and return them with a token
     *
     * @param array $attributes Optional user attributes
     * @return array{user: User, token: string}
     */
    public static function createAuthenticatedUser(array $attributes = []): array
    {
        $user = User::factory()->create($attributes);
        $token = $user->createToken('test-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Create admin user with known credentials
     *
     * @return User
     */
    public static function createAdminUser(): User
    {
        return User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@soleilfarm.vn',
            'password' => Hash::make('password123'),
        ]);
    }

    /**
     * Get authorization headers for a token
     *
     * @param string $token
     * @return array
     */
    public static function getAuthHeaders(string $token): array
    {
        return [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ];
    }

    /**
     * Get headers without authorization
     *
     * @return array
     */
    public static function getGuestHeaders(): array
    {
        return [
            'Accept' => 'application/json',
        ];
    }

    /**
     * Create user with specific password
     *
     * @param string $email
     * @param string $password
     * @param array $additionalAttributes
     * @return User
     */
    public static function createUserWithCredentials(
        string $email,
        string $password,
        array $additionalAttributes = []
    ): User {
        return User::factory()->create(array_merge([
            'email' => $email,
            'password' => Hash::make($password),
        ], $additionalAttributes));
    }

    /**
     * Register a new user and return response
     *
     * @param array $data
     * @return TestResponse
     */
    public static function register(array $data): TestResponse
    {
        return test()->postJson(self::API_BASE . '/auth/register', $data);
    }

    /**
     * Logout user
     *
     * @param string $token
     * @return TestResponse
     */
    public static function logout(string $token): TestResponse
    {
        return test()->withHeaders(self::getAuthHeaders($token))
            ->postJson(self::API_BASE . '/auth/logout');
    }

    /**
     * Get current user profile
     *
     * @param string $token
     * @return TestResponse
     */
    public static function me(string $token): TestResponse
    {
        return test()->withHeaders(self::getAuthHeaders($token))
            ->getJson(self::API_BASE . '/auth/me');
    }

    /**
     * Refresh token
     *
     * @param string $token
     * @return TestResponse
     */
    public static function refresh(string $token): TestResponse
    {
        return test()->withHeaders(self::getAuthHeaders($token))
            ->postJson(self::API_BASE . '/auth/refresh');
    }

    /**
     * Assert user is authenticated
     *
     * @param string $token
     * @return void
     */
    public static function assertAuthenticated(string $token): void
    {
        $response = self::me($token);
        test()->assertEquals(200, $response->status(), 'User should be authenticated');
    }

    /**
     * Assert user is not authenticated
     *
     * @param string $token
     * @return void
     */
    public static function assertNotAuthenticated(string $token): void
    {
        $response = self::me($token);
        test()->assertEquals(401, $response->status(), 'User should not be authenticated');
    }

    /**
     * Create multiple users with tokens
     *
     * @param int $count
     * @return array<array{user: User, token: string}>
     */
    public static function createMultipleAuthenticatedUsers(int $count): array
    {
        $users = [];

        for ($i = 0; $i < $count; $i++) {
            $users[] = self::createAuthenticatedUser([
                'email' => "user{$i}@example.com",
            ]);
        }

        return $users;
    }

    /**
     * Make authenticated request to any endpoint
     *
     * @param string $method HTTP method
     * @param string $endpoint API endpoint (without base path)
     * @param string $token Auth token
     * @param array $data Request data
     * @return TestResponse
     */
    public static function authenticatedRequest(
        string $method,
        string $endpoint,
        string $token,
        array $data = []
    ): TestResponse {
        $fullEndpoint = self::API_BASE . '/' . ltrim($endpoint, '/');

        return test()->withHeaders(self::getAuthHeaders($token))
            ->json($method, $fullEndpoint, $data);
    }
}
