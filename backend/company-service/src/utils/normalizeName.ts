export function normalizeDepartmentName(name : string) {
    return  name.replace(/\s+/g, '').trim().toLowerCase();
}