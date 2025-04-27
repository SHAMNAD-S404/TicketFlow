export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let i = 0;
  let count = seconds;

  for (; i < intervals.length - 1 && count >= intervals[i][0]; i++) {
    count = Math.floor(count / intervals[i][0]);
  }

  const unit = intervals[i][1];
  const plural = count !== 1 ? "s" : "";
  return `${count} ${unit}${plural} ago`;
};
