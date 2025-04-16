import {z} from "zod"

export const CreateCheckoutSchema = z.object({
    authUserUUID: z.string().trim(),
    companyName: z.string().trim(),
    companyEmail: z.string().trim().email(),
    amount: z.string().trim(),
    plan: z.string().trim(),
    planValidity: z.string().trim(),
    planStartDate: z.string().trim(),
    planEndDate: z.string().trim(),
    successUrl : z.string().trim(),
    cancelUrl : z.string().trim(),
})