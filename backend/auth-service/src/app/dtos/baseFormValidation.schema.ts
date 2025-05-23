import {z} from "zod"
import { regexPatterns } from "../../utils/regexPatterns";

//=================================  RESET PASSWORD SCHEMA ====================================
export const resetPasswordSchema  = z.object({
    token: z.string().trim().regex(/^[A-Za-z0-9_-]{21}$/, "Invalid token!"),
    password : z.string().trim().min(8).regex(regexPatterns.password)
});

//=================================  CHANGE PASSWORD SCHEMA ====================================

export const changePasswordSchema = z.object({
    currentPassword : z.string().trim().min(8).max(15),
    newPassword : z.string().trim().min(8).max(15).regex(regexPatterns.newPassword),
    email: z.string().trim().email()
})

//=================================   Register user schema ====================================
export const registerUserDTOSchema = z.object({
    email : z.string().trim().email(),
    password : z.string().trim().regex(regexPatterns.newPassword).min(8).max(15),
    companyName : z.string().trim().regex(regexPatterns.nameAndNumber).min(8).max(15),
    companyType : z.string().trim(),
    phoneNumber : z.string().trim().regex(regexPatterns.phoneNumber),
    corporatedId: z.string().trim().regex(regexPatterns.nameAndNumber).min(8).max(15),
    originCountry : z.string().trim().regex(regexPatterns.name).min(3).max(15)

});
