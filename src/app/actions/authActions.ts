"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import bcrypt from "bcryptjs";
import { ActionResults } from "../types";
import { User } from "@prisma/client";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function registerUser(
  data: RegisterSchema
): Promise<ActionResults<User>> {
  try {
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
      return { status: "error", error: validated.error.errors };
    }

    const { name, email, password } = validated.data;

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
      },
    });

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
