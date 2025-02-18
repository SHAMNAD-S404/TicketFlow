import {z} from 'zod';
import { regexPatterns } from './regexPatterns';

// export const  searchInputSchema = z.string()
//         .max(20,"enter less than 20 character")
//         .regex(/^[a-zA-Z]+([@.][a-zA-Z]+)*$/,"enter valid input")
//         .trim()
//         .or(z.literal(""));

export const searchInputSchema = z.object({
    searchKey:z.string().max(20).regex(regexPatterns.searchInputField).trim().or(z.literal("")),
    role:z.string().max(15).min(3).regex(regexPatterns.alphabatesOnly).trim(),
    page:z.coerce.number().min(1).max(100),
    sortBy:z.string().min(3).max(30).regex(regexPatterns.alphabatesOnly).trim(),
    companyId:z.string().min(8).max(30).regex(regexPatterns.alphabatesAndNumberOnly)
})


export type SearchQueryDTO = z.infer<typeof searchInputSchema>