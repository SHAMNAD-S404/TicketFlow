import {z} from "zod";
import { regexPatterns } from "./regexPatterns";

export const fetchDeptEmployeesSchema = z.object({
    id : z.string().trim().min(8).max(50).regex(regexPatterns.alphabatesAndNumberOnly),
    authUserUUID : z.string().trim().min(10).max(50).regex(regexPatterns.uuid_v4),
});



