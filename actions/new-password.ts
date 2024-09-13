"use server"

import {getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPassswordSchema } from "@/schemas"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db";

export const newPassword = async (values: z.infer<typeof NewPassswordSchema>, token: string | null) => {
  if(!token) return {error: "Missing token"};

  const validateField = NewPassswordSchema.safeParse(values);
  if(!validateField.success){
    return {error: "Invalid Fields"};
  }

  const existingToken = await getPasswordResetTokenByToken(token);
  if(!existingToken) return {error: "Invalid token"};

  const hasExpired = new Date(existingToken.expires) < new Date(); 
  if(hasExpired){
    return {error: "Token Expired"};
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if(!existingUser) return {error: "Email not found"};

  const hashedPassword = await bcrypt.hash(values.password, 10);

  await db.user.update({
    where: {
      id: existingUser.id
    },
    data: {
      password: hashedPassword
    }
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id
    }
  });

  return {success: "Password Updated"};
} 