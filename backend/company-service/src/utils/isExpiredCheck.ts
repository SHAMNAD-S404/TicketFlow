export const isPlanExpired = (date: string): boolean => {
  // Input date format is "DD-MM-YYYY"
  const [day, month, year] = date.split("-").map(Number);

  const expiryDate = new Date(year, month - 1, day);

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Return true if plan is expired
  return today > expiryDate;
};
