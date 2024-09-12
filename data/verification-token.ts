import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  console.log("getVerificationTokenByToken", token);
  try{
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token
      }
    });
    console.log("verificationToken", verificationToken);
    return verificationToken;
  }
  catch{
    return null;
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  try{
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email: email
      }
    });
    return verificationToken;
  }
  catch{
    return null;
  }
}