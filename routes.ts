export const protectedRoutes = [
  "/settings"   // Protected route like settings page
];

export const authRoutes = [
  "/",          // Home page
  "/auth/login",  // Login page
  "/auth/register",  // Registration page
  "/auth/error",
  "/auth/new-verification"
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/settings"; 