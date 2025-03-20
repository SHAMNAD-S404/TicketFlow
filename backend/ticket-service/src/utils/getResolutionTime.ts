function getResolutionTime(createdDate: string, closedDate: string): string {
  //converting string to date object
  const createDateObj = new Date(createdDate);
  const closedDateObj = new Date(closedDate);

  //calculating the diff in milliseconds
  const diffMs = closedDateObj.getTime() - createDateObj.getTime();

  //converting diff into seconds
  const diffSeconds = Math.floor(diffMs / 1000);

  //calculate days ,hours ,mint , seconds
  const days = Math.floor(diffSeconds / (3600 * 24));
  const hours = Math.floor((diffSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const resolutionDate = `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
  return resolutionDate;
}

export default getResolutionTime;
