<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Token expiration in minutes (7 days)
     */
    private const TOKEN_EXPIRATION_MINUTES = 60 * 24 * 7;

    /**
     * Login user and return Sanctum token
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            // Log failed login attempt for security monitoring
            Log::warning('Failed login attempt', [
                'email' => $validated['email'],
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            throw ValidationException::withMessages([
                'email' => ['Email hoặc mật khẩu không đúng.'],
            ]);
        }

        // Revoke existing tokens for security (optional - single device login)
        // Uncomment if you want single-device authentication
        // $user->tokens()->delete();

        // Create Sanctum token with expiration
        $tokenResult = $user->createToken(
            'auth-token',
            ['*'],
            now()->addMinutes(self::TOKEN_EXPIRATION_MINUTES)
        );

        // Log successful login
        Log::info('User logged in', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                ],
                'tokens' => [
                    'token' => $tokenResult->plainTextToken,
                    'token_type' => 'Bearer',
                    'expires_at' => now()->addMinutes(self::TOKEN_EXPIRATION_MINUTES)->toISOString(),
                ],
            ],
        ]);
    }

    /**
     * Get authenticated user information
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
            ],
        ]);
    }

    /**
     * Logout user and revoke current token
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Get the current access token and delete it
        $request->user()->currentAccessToken()->delete();

        Log::info('User logged out', [
            'user_id' => $request->user()->id,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công',
        ]);
    }

    /**
     * Logout from all devices (revoke all tokens)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logoutAll(Request $request): JsonResponse
    {
        // Revoke all tokens for the user
        $request->user()->tokens()->delete();

        Log::info('User logged out from all devices', [
            'user_id' => $request->user()->id,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã đăng xuất khỏi tất cả thiết bị',
        ]);
    }

    /**
     * Register new user and return Sanctum token
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Create Sanctum token with expiration
        $tokenResult = $user->createToken(
            'auth-token',
            ['*'],
            now()->addMinutes(self::TOKEN_EXPIRATION_MINUTES)
        );

        Log::info('New user registered', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký thành công',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                ],
                'tokens' => [
                    'token' => $tokenResult->plainTextToken,
                    'token_type' => 'Bearer',
                    'expires_at' => now()->addMinutes(self::TOKEN_EXPIRATION_MINUTES)->toISOString(),
                ],
            ],
        ], 201);
    }

    /**
     * Refresh current token (issue new token and revoke old one)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();

        // Delete current token
        $request->user()->currentAccessToken()->delete();

        // Create new token
        $tokenResult = $user->createToken(
            'auth-token',
            ['*'],
            now()->addMinutes(self::TOKEN_EXPIRATION_MINUTES)
        );

        return response()->json([
            'success' => true,
            'message' => 'Token đã được làm mới',
            'data' => [
                'token' => $tokenResult->plainTextToken,
                'token_type' => 'Bearer',
                'expires_at' => now()->addMinutes(self::TOKEN_EXPIRATION_MINUTES)->toISOString(),
            ],
        ]);
    }
}
