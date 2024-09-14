import NextAuth, {DefaultSession} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string; 
      isTwoFactorEnabled?: boolean //caution
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string; 
    isTwoFactorEnabled?: boolean //caution
    // Role is optional here too
  }

  interface JWT {
    role?: string; // JWT token should also have an optional role
  }
}