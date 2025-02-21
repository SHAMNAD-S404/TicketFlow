import {z} from "zod";
import { regexPatterns } from "./regexPatterns";

export const departmentUpdateSchema = z.object ({
    id:z.string().trim().max(50).min(8).regex(regexPatterns.alphabatesAndNumberOnly),
    departmentName: z.string().trim().min(4).max(30).regex(regexPatterns.alphabatesAndSpaces),
    responsibilities : z.string().trim().min(5).max(100).regex(regexPatterns.textWithSpaceAndCommas)
})

export type departmentUpdateDTO = z.infer<typeof departmentUpdateSchema>