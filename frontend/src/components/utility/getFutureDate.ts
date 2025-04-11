export const getFutureDate = (createDate: Date, expireInDays: string): string => {
  const daysToAdd = parseInt(expireInDays, 10);

  if (isNaN(daysToAdd)) {
    throw new Error("Invalid number of days");
  }

  const startDate = new Date(createDate);
  startDate.setDate(startDate.getDate() + daysToAdd);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = dayNames[startDate.getDay()];
  const day = String(startDate.getDate()).padStart(2, "0");
  const month = monthNames[startDate.getMonth()];
  const year = startDate.getFullYear();

  return `${dayName}, ${day}-${month}-${year}`;
};

//********888888888888888888888888888888888888888888888888888888888888888888888888888888888 */


export const getDayCountByPlan = (plan: string): string => {
  if (plan === "Free Tier") return "7";

  const match = plan.match(/^(\d+)\s+months/i);
  if (match && match[1]) {
    const months = parseInt(match[1], 10);
    const days = months * 30;
    return days.toString();
  }

  throw new Error("Invalid plan format");
};
