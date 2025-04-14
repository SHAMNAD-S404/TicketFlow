export const findMaxDate = (date: string): string => {
    
  const [day, month, year] = date.split("-").map(Number);
  const inputDate = new Date(year, month - 1, day);

  //get current date
  const currentDate = new Date();

  //compare date
  const maxDate = inputDate > currentDate ? inputDate : currentDate;

  const resultDay = String(maxDate.getDate()).padStart(2, "0");
  const resultMonth = String(maxDate.getMonth() + 1).padStart(2, "0");
  const resultYear = String(maxDate.getFullYear());

  return `${resultDay}-${resultMonth}-${resultYear}`;
};
