import {z} from "zod"
import { regexPatterns } from "../../utils/regexPatterns";

export const resetPasswordSchema  = z.object({
    token: z.string().trim().regex(/^[A-Za-z0-9_-]{21}$/, "Invalid token!"),
    password : z.string().trim().min(8).regex(regexPatterns.password)
});