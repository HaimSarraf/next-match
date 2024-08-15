import { z } from "zod";

export const memberEditSchema = z.object({
  name: z.string().min(1, {
    message: "Name Is Required",
  }),
  description: z.string().min(1, {
    message: "Description Is Required",
  }),
  city: z.string().min(1, {
    message: "City Is Required",
  }),
  country: z.string().min(1, {
    message: "Country Is Required",
  }),
});

export type MemberEditSchema = z.infer<typeof memberEditSchema>;
