import { z } from "zod";
import { calculateAge } from "../utils";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6-Characters",
  }),
});

export const profileSchema = z.object({
  gender: z.string().min(1),
  description: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  dateOfBirth: z
    .string()
    .min(1, {
      message: "Date Of Birth Is Required",
    })
    .refine(
      (dateString) => {
        const age = calculateAge(new Date(dateString));
        return age >= 15;
      },
      {
        message: "Must be at least 15-y.o To Register",
      }
    ),
});

export const combainedRegisterSchema = registerSchema.and(profileSchema);

export type ProfileSchema = z.infer<typeof profileSchema>

export type RegisterSchema = z.infer<
  typeof registerSchema & typeof profileSchema
>;
