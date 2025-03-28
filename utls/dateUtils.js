export const generateDateList = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate.getTime() <= lastDate.getTime()) {
    dates.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dates;
};