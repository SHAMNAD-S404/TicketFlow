import {z} from "zod";
import { regexPatterns } from "./regexPatterns";

export const authUserUUIDSchema = z.string()
                .min(8).max(60).regex(regexPatterns.uuid_v4).trim();

export const emailSchema = z.string()
                .min(5).max(30).email().trim();


export type authUserUuidDTO = z.infer<typeof authUserUUIDSchema>
export type emailSchemaDTO = z.infer<typeof emailSchema >