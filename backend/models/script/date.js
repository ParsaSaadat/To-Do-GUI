// A utility class for handling date-related operations

export default class getDate {
  // Get the current month name
  static getMonth() {
    let date = new Date();
    let monthName = [
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
    monthName = monthName[date.getMonth()];
    return monthName;
  }

  // Get the current day of the week
  static getDay() {
    let date = new Date();
    let weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    weekday = weekday[date.getDay()];
    return weekday;
  }

  // Get the current hour (12-hour format)
  static getHour() {
    const date = new Date();
    let hour = [
      12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11,
    ];
    hour = hour[date.getHours()];
    return hour;
  }

  // Get the current minute
  static getMin() {
    const date = new Date();
    return date.getMinutes();
  }

  static getYear() {
    const date = new Date();
    return date.getFullYear();
  }

  // Get the current year or a formatted date string
  static getAll(type) {
    if (type === true) {
      return `${getDate.getYear()}/${getDate.getMonth()}/${getDate.getDay()}`;
    }
    return {
      year: getDate.getYear(),
      month: getDate.getMonth(),
      day: getDate.getDay(),
      hour: getDate.getHour(),
      min: getDate.getMin(),
    };
  }
}
