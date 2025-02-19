import {z} from "zod";
import { regexPatterns } from "./regexPatterns";

export const departmentUpdateSchema = z.object ({
    id:z.string().max(50).min(8).regex(regexPatterns.alphabatesAndNumberOnly).trim(),
    departmentName: z.string().min(4).max(30).regex(regexPatterns.alphabatesAndSpaces).trim(),
    responsibilities : z.string().trim().min(5).max(100).regex(regexPatterns.textWithSpaceAndCommas)
})

export type departmentUpdateDTO = z.infer<typeof departmentUpdateSchema>