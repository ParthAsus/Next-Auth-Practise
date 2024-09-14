"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (value: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(value);
  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validateFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email not found!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Confirmation email sent!" };
  }

  // 2FA
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if(!twoFactorToken) return  { error: "Two-factor token not found!" };

      if(twoFactorToken.token !== code){
        return {error: "Code is incorrect"};
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if(hasExpired){
        return {error: "Code Expired"};
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id
        }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if(existingConfirmation){
        console.log("Two-factor confirmation already exists for user:", existingUser.id);
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id
          }
        })
      };

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })

    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  // Sign in using credintials
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
