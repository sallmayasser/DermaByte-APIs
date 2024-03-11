const moment = require('moment');

// exports.divideTimeRange = (startTime, endTime, period) => {
//   const intervals = [];

//   // Convert start and end times to Date objects
//   const startDate = new Date(startTime);
//   const endDate = new Date(endTime);

//   // Add 2 hours
//   startDate.setHours(startDate.getHours() + 2);
//   endDate.setHours(endDate.getHours() + 2);

//   // Calculate the difference in milliseconds between start and end times
//   const timeDiff = endDate - startDate;

//   // Convert period to milliseconds
//   const periodMillis = period * 60 * 1000; // assuming period is in minutes

//   // Initialize the current interval with the start time
//   let currentInterval = startDate.getTime();

//   // Loop through the time range, adding intervals of the specified period
//   while (currentInterval < endDate.getTime()) {
//     intervals.push(new Date(currentInterval));
//     // intervals.push({ time: new Date(currentInterval), reserved: false });
//     // intervals.push({
//     //   id: index,
//     //   time: new Date(currentInterval),
//     //   reserved: false,
//     // });
//     currentInterval += periodMillis;

//   }

//   return intervals;
// };

// exports.divideTimeRangeForOneDay = (reserved, schedule) => {
//   const intervals = [];
//   schedule.forEach((time) => {
//     const startDate = new Date(time.startTime);
//     const endDate = new Date(time.endTime);
//     const times = [];
//     while (startDate < endDate) {
//       // Check if startTimeStamp exists in reserved array
//       const index = reserved.findIndex(
//         (date) => date.getTime() === startDate.getTime(),
//       );
//       if (index !== -1) {
//         reserved.splice(index, 1); // Remove the date from reserved array
//       } else {
//         times.push(new Date(startDate.getTime())); // Push a new Date object to times array
//       }
//       startDate.setMinutes(startDate.getMinutes() + +time.sessionTime);
//     }
//     intervals.push({ day: time.day, freeTime: times });
//   });
//   return intervals;
// };

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

exports.divideTimeRange = (reserved, schedule, month) => {
  const intervals = [];
  const currentDate = moment(); // Represents the current date
  const numDays = daysInMonth(currentDate.year(), currentDate.month());
  for (let day = moment(Date.now()).date(); day <= numDays; day += 1) {
    const year = month.year();
    const monthIndex = month.month();
    const dayOfWeek = moment([year, monthIndex, day]).day();

    schedule.forEach((time) => {
      const momentStartTime = moment(time.startTime);
      // Check if the schedule entry matches the desired day of the week
      if (dayOfWeek === momentStartTime.day()) {
        const startDate = new Date(
          year,
          monthIndex,
          day,
          time.startTime.getHours(),
          time.startTime.getMinutes(),
        );
        const endDate = new Date(
          year,
          monthIndex,
          day,
          time.endTime.getHours(),
          time.endTime.getMinutes(),
        );
        const times = [];
        while (startDate < endDate) {
          const index = reserved.findIndex(
            (date) => date.getTime() === startDate.getTime(),
          );
          if (index !== -1) {
            reserved.splice(index, 1); // Remove the date from reserved array
          } else {
            times.push(new Date(startDate.getTime())); // Push a new Date object to times array
          }
          startDate.setMinutes(startDate.getMinutes() + +time.sessionTime);
        }

        intervals.push({ day: `${time.day} ${day}`, freeTime: times });
      }
    });
  }

  return intervals;
};
