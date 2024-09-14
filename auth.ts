import NextAuth from "next-auth"
import authConfig from "./auth.config"
import {PrismaAdapter} from "@auth/prisma-adapter";
import {db} from "@/lib/db";
import { getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const { auth, signIn, signOut, handlers: {GET, POST} 
} = NextAuth({ 

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  events: {
    async linkAccount({user}){
      await db.user.update({
        where: {id: user.id},
        data: {emailVerified: new Date()}
      });
    }
  },
 
  callbacks: {
    async signIn({user, account}){
      if(account?.provider != "credentials") return true;

      if(!user.id) return false; // not sure
      const existingUser = await getUserById(user.id);

      if(!existingUser?.emailVerified) return false;

      // 2FA
      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        console.log("Two-Factor Confirmation:", twoFactorConfirmation); // Added logging

        if(!twoFactorConfirmation) {
            console.error("No two-factor confirmation found for user:", existingUser.id); // Error logging
            return false;
        }
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation?.id
          }
        });
      }

      return true;
    },

    async session({token, session}){
      if(token.sub && session.user){
        session.user.id = token.sub;
      }

      if(token.role && session.user){
        session.user.role = token.role as string;
      }

      if(token.isTwoFactorEnabled && session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }


      return session;
    },
    async jwt({token}){
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if(!existingUser) return token;

      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    } 
  },
  adapter: PrismaAdapter(db),
  session: {strategy: 'jwt'},
  ...authConfig
});