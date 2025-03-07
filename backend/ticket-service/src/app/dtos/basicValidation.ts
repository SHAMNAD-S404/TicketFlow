import { z } from "zod";
import { regexPatterns } from "./regexPatterns";

export const searchInputSchema = z.object({
    searchQuery:z.string().trim().max(20).regex(regexPatterns.searchInputField).or(z.literal("")),
    role:z.string().trim().max(15).min(3).regex(regexPatterns.alphabatesOnly),
    page:z.coerce.number().min(1).max(100),
    sortBy:z.string().trim().min(3).max(30).regex(regexPatterns.alphabatesOnly),
    authUserUUID:z.string().trim().min(8).max(60).regex(regexPatterns.uuid_v4)
})

export const ticketReassignSchema = z.object({
    ticketId : z.string().trim().min(7).max(40).regex(regexPatterns.alphabatesAndNumberOnly),
    selectedDepartmentId : z.string().trim().min(7).max(40).regex(regexPatterns.alphabatesAndNumberOnly),
    selectedDepartmentName : z.string().trim().min(3).max(50).regex(regexPatterns.alphabatesAndSpaces),
    selectedEmployeeId  : z.string().trim().min(7).max(40).regex(regexPatterns.alphabatesAndNumberOnly),
    selectedEmployeeName : z.string().trim().min(3).max(40).regex(regexPatterns.alphabatesAndSpaces)
})

export const TicketFormValidation = z.object({
    ticketReason : z.string().trim().min(5).max(40).regex(regexPatterns.textWithSpaceAndCommas),
    description : z.string().trim().min(10).max(200).regex(regexPatterns.textAreaValidation),
    priority : z.string().trim().min(4).max(40).regex(regexPatterns.textWithSpaceAndCommas),
    dueDate : z.string().trim().min(5).max(30).regex(regexPatterns.textAreaValidation),
    supportType : z.string().trim().regex(regexPatterns.textAreaValidation),
    ticketRaisedDepartmentName : z.string().trim().regex(regexPatterns.textWithSpaceAndCommas),
    ticketRaisedDepartmentId : z.string().trim().regex(regexPatterns.objectIdRegex),
    ticketRaisedEmployeeId : z.string().trim().regex(regexPatterns.objectIdRegex),
    ticketRaisedEmployeeName : z.string().trim().min(4).max(40).regex(regexPatterns.alphabatesAndSpaces),
    ticketHandlingDepartmentId : z.string().trim().regex(regexPatterns.objectIdRegex),
    ticketHandlingDepartmentName : z.string().trim().min(3).max(50).regex(regexPatterns.alphabatesAndSpaces),
    ticketHandlingEmployeeId : z.string().trim().regex(regexPatterns.objectIdRegex),
    ticketHandlingEmployeeName : z.string().trim().min(4).max(40).regex(regexPatterns.alphabatesAndSpaces)

})


export const authUserUUIDValidation = z.object({
    authUserUUID : z.string().trim().min(36).max(36).regex(regexPatterns.uuid_v4)
});

