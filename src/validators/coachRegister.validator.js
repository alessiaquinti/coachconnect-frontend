import { z } from "zod"

export const coachRegisterSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  email: z.string().email("Inserisci un'email valida"),
  password: z
    .string()
    .min(6, "La password deve contenere almeno 6 caratteri")
    .regex(/[A-Z]/, "Deve contenere almeno una lettera maiuscola")
    .regex(/[0-9]/, "Deve contenere almeno un numero"),
})
