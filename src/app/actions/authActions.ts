"use server";

import { prisma } from "@/lib/prisma";
import {
  combainedRegisterSchema,
  ProfileSchema,
  registerSchema,
  RegisterSchema,
} from "@/lib/schemas/registerSchema";
import bcrypt from "bcryptjs";
import { ActionResults } from "../types";
import { TokenType, User } from "@prisma/client";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { generateToken, getTokenByToken } from "@/lib/tokens";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";

export async function registerUser(
  data: RegisterSchema
): Promise<ActionResults<User>> {
  try {
    const validated = combainedRegisterSchema.safeParse(data);

    if (!validated.success) {
      return { status: "error", error: validated.error.errors };
    }

    const {
      name,
      email,
      password,
      city,
      country,
      dateOfBirth,
      description,
      gender,
    } = validated.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { status: "error", error: "User Already Exists" };
    }

    //best practice : Do Not use 'AWAIT' when return sth
    // const user = await prisma.user. ... : ok
    // return await prisma.user. ...       : #
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        profileComplete: true,
        member: {
          create: {
            name,
            description,
            city,
            country,
            dateOfBirth: new Date(dateOfBirth),
            gender,
          },
        },
      },
    });

    const verificationToken = await generateToken(
      email,
      TokenType.VERIFICATION
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { status: "success", data: user };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something Went Wrong" };
  }
}
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}
export async function signInUser(
  data: LoginSchema
): Promise<ActionResults<string>> {
  try {
    const existingUser = await getUserByEmail(data.email);

    if (!existingUser || !existingUser.email) {
      return { status: "error", error: "Invalid Credentials" };
    }

    if (!existingUser.emailVerified) {
      const token = await generateToken(
        existingUser.email,
        TokenType.VERIFICATION
      );

      await sendVerificationEmail(token.email, token.token);

      return {
        status: "error",
        error: "Please Verify Your Email Address Before Logging In",
      };
    }

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log(result);

    return {
      status: "success",
      data: "Logged In",
    };
  } catch (error) {
    console.log(error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", error: "Invalid Credentials" };

        default:
          return { status: "error", error: "Something Went Wrong" };
      }
    } else {
      return { status: "error", error: "Something Went Wrong" };
    }
  }
}
export async function SignOutUser() {
  await signOut({ redirectTo: "/" });
}
export async function getAuthUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User Not Authorized");

  return userId;
}
export async function verifyEmail(
  token: string
): Promise<ActionResults<string>> {
  try {
    const existingToken = await getTokenByToken(token);

    if (!existingToken) {
      return { status: "error", error: "Invalid Token" };
    }

    const hasExpired = new Date() > existingToken.expires;

    if (hasExpired) {
      return { status: "error", error: "Token Has Expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { status: "error", error: "User Not Found" };
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date() },
    });

    await prisma.token.delete({ where: { id: existingToken.id } });

    return { status: "success", data: "Success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function generateResetPasswordEmail(
  email: string
): Promise<ActionResults<string>> {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { status: "error", error: "Email Not Found" };
    }

    const token = await generateToken(email, TokenType.PASSWORD_RESET);

    await sendPasswordResetEmail(token.email, token.token);

    return {
      status: "success",
      data: "PASSWORD-RESET-Email Has Been Sent.Please Check Your Email-Inbox",
    };
  } catch (error) {
    return { status: "error", error: "Something Went Wrong" };
  }
}
export async function resetPassword(
  password: string,
  token: string | null
): Promise<ActionResults<string>> {
  try {
    if (!token) {
      return { status: "error", error: "Missing Token(s)" };
    }

    const existingToken = await getTokenByToken(token);

    if (!existingToken) {
      return { status: "error", error: "Invalid Token" };
    }

    const hasExpired = new Date() > existingToken.expires;

    if (hasExpired) {
      return { status: "error", error: "Token Has Expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { status: "error", error: "User Not Found" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { passwordHash: hashedPassword },
    });

    await prisma.token.delete({
      where: {
        id: existingToken.id,
      },
    });

    return {
      status: "success",
      data: "Password Updated Successfully, Please Try Logging In",
    };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something Went Wrong" };
  }
}
export async function completeSocialLoginProfile(
  data: ProfileSchema
): Promise<ActionResults<string>> {
  const session = await auth();

  if (!session?.user) return { status: "error", error: "User No Found" };

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        profileComplete: true,
        member: {
          create: {
            name: session.user.name as string,
            image: session.user.image,
            gender: data.gender,
            dateOfBirth: new Date(data.dateOfBirth),
            city: data.city,
            country: data.country,
            description: data.description,
          },
        },
      },
      select: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    return { status: "success", data: user.accounts[0].provider };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something Went Wrong" };
  }
}
