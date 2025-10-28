import moment from "moment";

export function objectToQueryString(params) {
  // Filter out null, undefined, or empty string values
  const filteredParams = Object.keys(params)
    .filter(
      (key) =>
        params[key] !== null && params[key] !== undefined && params[key] !== ""
    )
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});

  // Create query string
  const queryString = Object.keys(filteredParams)
    .map(
      (key) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(filteredParams[key])
    )
    .join("&");

  return queryString;
}

export const handleValidDate = (date) => {
  return moment(new Date(date)).format("DD MMM Y");
};

export const handleValidTime = (time) => {
  const time1 = new Date(time);
  const getHour = time1.getUTCHours();
  const getMin = time1.getUTCMinutes();
  const getTime = `${getHour}:${getMin}`;
  var meridiem = "";
  if (getHour >= 12) {
    meridiem = "PM";
  } else {
    meridiem = "AM";
  }
  const updateTime = moment(getTime, "hh:mm").format("hh:mm") + " " + meridiem;
  return updateTime;
};
