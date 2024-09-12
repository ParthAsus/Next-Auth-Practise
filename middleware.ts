import authConfig from "./auth.config";
import NextAuth from "next-auth";
const { auth } = NextAuth(authConfig);
import { DEFAULT_LOGIN_REDIRECT, authRoutes, protectedRoutes } from "@/routes";
import { NextResponse } from "next/server";

export default auth((req) => {
  const currentPathname = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  console.log(`Current Pathname: ${currentPathname}`);
  console.log(`Is Logged In: ${isLoggedIn}`);

  // Prevent logged-in users from accessing login or registration pages
  if (authRoutes.includes(currentPathname)) {
    if (isLoggedIn) {
      console.log("Access denied for auth routes for logged-in users");
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl.origin));
    }
  }

  // Redirect non-logged-in users away from pro tected routes
  if (protectedRoutes.includes(currentPathname)) {
    if (!isLoggedIn) {
      console.log("Access denied for protected routes for not logged-in users");
      return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
