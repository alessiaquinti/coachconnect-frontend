import { z } from "zod"

export const customerProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Il nome deve avere almeno 2 caratteri" }),

  email: z
    .string()
    .email({ message: "Inserisci un'email valida" }),

  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Inserisci una data valida (YYYY-MM-DD)",
    })
    .optional(),

  gender: z.enum(["M", "F", "Altro"]).optional(),

  height: z
    .union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => val > 0 && val <= 300, {
      message: "L'altezza deve essere compresa tra 1 e 300 cm",
    })
    .optional(),

  weight: z
    .union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => val > 0 && val <= 500, {
      message: "Il peso deve essere compreso tra 1 e 500 kg",
    })
    .optional(),
})
