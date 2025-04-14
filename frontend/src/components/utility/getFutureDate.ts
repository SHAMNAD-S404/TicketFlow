export const getPlanEndDate = (planStartDate: string, validity: string): string => {

  
  const [day, month, year] = planStartDate.split("-").map(Number);

  // Create a Date object from planStartDate
  const startDate = new Date(year, month - 1, day); // months are 0-indexed

  const monthsToAdd = parseInt(validity.split(" ")[0], 10);

  // Add the months
  startDate.setMonth(startDate.getMonth() + monthsToAdd);

  // Format the result as "day-month-year"
  const endDay = String(startDate.getDate()).padStart(2, "0");
  const endMonth = String(startDate.getMonth() + 1).padStart(2, "0");
  const endYear = startDate.getFullYear();

  return `${endDay}-${endMonth}-${endYear}`;
};
