import type {
  User,
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
} from '@/schemas';
import { http, setAuthToken, clearAuthTokens, getAuthToken } from '@/services/api/http-client';

// ============================================================================
// API ENDPOINTS
// ============================================================================

const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

// ============================================================================
// AUTH SERVICE
// ============================================================================

/**
 * Authentication Service
 * ======================
 * Handles all authentication-related API operations including login,
 * registration, token management, and user session.
 *
 * @example
 * // Login
 * const { user, access_token } = await authService.login({
 *   email: 'user@example.com',
 *   password: 'password123',
 * });
 *
 * // Get current user
 * const user = await authService.getCurrentUser();
 *
 * // Logout
 * await authService.logout();
 */
export const authService = {
  /**
   * Authenticate user and obtain access token
   *
   * @param credentials - User credentials
   * @returns Login response with user data and access token
   *
   * @example
   * const { user, access_token } = await authService.login({
   *   email: 'user@example.com',
   *   password: 'securePassword123',
   * });
   */
  async login(credentials: LoginInput): Promise<LoginResponse> {
    const response = await http.post<{ data: LoginResponse }>(ENDPOINTS.LOGIN, credentials);

    // Store the token - backend returns nested in data
    const loginData = response.data;
    if (loginData.data?.tokens?.token) {
      setAuthToken(loginData.data.tokens.token);
    }

    return loginData;
  },

  /**
   * Register a new user account
   *
   * @param data - Registration data
   * @returns Registration response with user data
   *
   * @example
   * const { user } = await authService.register({
   *   name: 'Nguyễn Văn A',
   *   email: 'user@example.com',
   *   password: 'securePassword123',
   *   password_confirmation: 'securePassword123',
   * });
   */
  async register(data: RegisterInput): Promise<RegisterResponse> {
    const response = await http.post<RegisterResponse>(ENDPOINTS.REGISTER, data);

    // Auto-login after registration if token is provided
    if (response.data.tokens?.token) {
      setAuthToken(response.data.tokens.token);
    }

    return response;
  },

  /**
   * Log out the current user and invalidate the token
   *
   * @example
   * await authService.logout();
   */
  async logout(): Promise<void> {
    try {
      await http.post(ENDPOINTS.LOGOUT);
    } finally {
      // Always remove token even if API call fails
      clearAuthTokens();
    }
  },

  /**
   * Get the currently authenticated user
   *
   * @returns Current user data
   *
   * @example
   * const user = await authService.getCurrentUser();
   * console.log(user.name); // "Nguyễn Văn A"
   */
  async getCurrentUser(): Promise<User> {
    const response = await http.get<{ data: User }>(ENDPOINTS.ME);
    return response.data;
  },

  /**
   * Refresh the access token
   *
   * @returns New access token
   *
   * @example
   * const { access_token } = await authService.refreshToken();
   */
  async refreshToken(): Promise<{ access_token: string }> {
    const response = await http.post<{ data: { token: string } }>(ENDPOINTS.REFRESH);

    if (response.data.token) {
      setAuthToken(response.data.token);
    }

    return { access_token: response.data.token };
  },

  /**
   * Request a password reset email
   *
   * @param email - User's email address
   *
   * @example
   * await authService.forgotPassword('user@example.com');
   */
  async forgotPassword(email: string): Promise<void> {
    await http.post(ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token from email
   *
   * @param data - Reset password data
   *
   * @example
   * await authService.resetPassword({
   *   token: 'reset-token-from-email',
   *   email: 'user@example.com',
   *   password: 'newSecurePassword',
   *   password_confirmation: 'newSecurePassword',
   * });
   */
  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await http.post(ENDPOINTS.RESET_PASSWORD, data);
  },

  /**
   * Check if user is authenticated (has valid token)
   *
   * @returns Boolean indicating authentication status
   *
   * @example
   * if (authService.isAuthenticated()) {
   *   // User is logged in
   * }
   */
  isAuthenticated(): boolean {
    return !!getAuthToken();
  },

  /**
   * Get the current access token
   *
   * @returns Access token or null
   */
  getToken: getAuthToken,

  /**
   * Set the access token manually
   *
   * @param token - Access token to store
   */
  setToken: setAuthToken,

  /**
   * Remove the access token
   */
  removeToken: clearAuthTokens,
} as const;

export default authService;
