import {z} from 'zod';
import { regexPatterns } from './regexPatterns';


export const searchInputSchema = z.object({
    searchKey:z.string().max(20).regex(regexPatterns.searchInputField).trim().or(z.literal("")),
    role:z.string().max(15).min(3).regex(regexPatterns.alphabatesOnly).trim(),
    page:z.coerce.number().min(1).max(100),
    sortBy:z.string().min(3).max(30).regex(regexPatterns.alphabatesOnly).trim(),
    companyId:z.string().min(8).max(30).regex(regexPatterns.alphabatesAndNumberOnly)
})

export const departmentEmployeeSchema = z.object ( {
    companyId : z.string().trim().min(8).max(30).regex(regexPatterns.alphabatesAndNumberOnly),
    departmentId: z.string().trim().min(8).max(30).regex(regexPatterns.alphabatesAndNumberOnly),
    currentPage :z.coerce.number().min(1).max(100),
    sortBy : z.string().trim().min(3).max(30).regex(regexPatterns.alphabatesOnly),
    searchKey : z.string().trim().max(20).regex(regexPatterns.searchInputField).or(z.literal("")),
    role : z.string().trim().min(3).max(15).regex(regexPatterns.alphabatesOnly),

})


export type SearchQueryDTO = z.infer<typeof searchInputSchema>
export type DepartmentEmployeeDTO = z.infer<typeof departmentEmployeeSchema>