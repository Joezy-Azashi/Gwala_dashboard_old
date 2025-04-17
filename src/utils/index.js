import moment from "moment";

export const convertDate = (date) => {
  const tmp = new Date(date);

  const day = tmp.getDate().toString().padStart(2, "0");
  const month = (tmp.getMonth() + 1).toString().padStart(2, "0");
  const year = tmp.getFullYear().toString();
  const hours = tmp.getHours().toString().padStart(2, "0");
  const minutes = tmp.getMinutes().toString().padStart(2, "0");

  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

  return formattedDate;
};

export const sortArrayAlphabetically = ({
  arr,
  key = "firstName",
  order = 1,
}) => {
  // key that u want to sort by
  return arr.sort(function (a, b) {
    const x =
      typeof key !== "object"
        ? a[key].toLowerCase()
        : a[Object.keys(key)[0]][Object.values(key)[0]]?.toLowerCase();
    const y =
      typeof key !== "object"
        ? b[key].toLowerCase()
        : b[Object.keys(key)[0]][Object.values(key)[0]]?.toLowerCase();
    let result = 0;
    if (x < y) {
      result = -1;
    } else if (x > y) {
      result = 1;
    }
    if (order === -1) {
      result = -result;
    }
    return result;
  });
};

export const differenceTwoDate = (startDate, endDate) => {
  const startDateTmp = new Date(startDate);
  const endDateTmp = new Date(endDate);
  const timeDifference = endDateTmp.getTime() - startDateTmp.getTime();
  const durationInDays = Math.ceil(timeDifference / (1000 * 3600 * 24) + 1);
  return durationInDays;
};
