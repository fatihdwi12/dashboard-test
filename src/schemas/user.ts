// src/schemas/user.ts
import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().optional(),
  suite: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
  geo: z
    .object({
      lat: z.string().optional(),
      lng: z.string().optional(),
    })
    .optional(),
});

export const companySchema = z.object({
  name: z.string().optional(),
  catchPhrase: z.string().optional(),
  bs: z.string().optional(),
});

export const userPatchSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  username: z.string().min(1, "Username is required").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: addressSchema.optional(),
  company: companySchema.optional(),
});

// tipe TypeScript dari schema
export type UserPatch = z.infer<typeof userPatchSchema>;
