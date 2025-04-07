import {z} from "zod"
import { regexPatterns } from "../../utils/regexPatterns";

export const resetPasswordSchema  = z.object({
    token: z.string().trim().regex(/^[A-Za-z0-9_-]{21}$/, "Invalid token!"),
    password : z.string().trim().min(8).regex(regexPatterns.password)
});


export const changePasswordSchema = z.object({
    currentPassword : z.string().trim().min(8).max(15),
    newPassword : z.string().trim().min(8).max(15).regex(regexPatterns.newPassword),
    email: z.string().trim().email()
})