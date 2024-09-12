"use server"
import { RegisterSchema } from "@/schemas";
import { error } from "console";
import { z } from "zod";
import bcrypt from "bcryptjs";
import {db} from '@/lib/db';
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  if(!validateFields.success){
    return {error: "Invalid Fields"};
  }
  const {email, password, name} = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if(existingUser){
    return {error: "Email already registered"};
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    }
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token
  );

  // Send verification email here if required

  return {success: "Confirmation email sent!"};
}
