import {z} from "zod";
import { regexPatterns } from "./regexPatterns";
import departement from "../repositories/implements/departement";

export const fetchDeptEmployeesSchema = z.object({
    id : z.string().trim().min(8).max(50).regex(regexPatterns.alphabatesAndNumberOnly),
    authUserUUID : z.string().trim().min(10).max(50).regex(regexPatterns.uuid_v4),
});

export const changeDepartmentSchema = z.object({
    employeeId : z.string().trim().min(8).max(30).regex(regexPatterns.alphabatesAndNumberOnly),
    departmentId : z.string().trim().min(8).max(30).regex(regexPatterns.alphabatesAndNumberOnly),
    departmentName : z.string().trim().regex(regexPatterns.alphabatesAndSpaces),
});



