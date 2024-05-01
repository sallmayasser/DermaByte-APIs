const moment = require('moment');

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
exports.divideTimeRange = (reserved, schedule, currentDate) => {
  const intervals = [];
  const numDays = daysInMonth(currentDate.year(), currentDate.month());

  // Iterate through each day in the current month
  for (let day = moment(currentDate).date(); day <= numDays; day++) {
    const year = currentDate.year();
    const monthIndex = currentDate.month();
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

        // Check if the start date is in the future or current time

        const times = [];
        while (startDate < endDate) {
          if (moment(startDate).isSameOrAfter(moment())) {
            const index = reserved.findIndex(
              (date) => date.getTime() === startDate.getTime(),
            );
            if (index !== -1) {
              reserved.splice(index, 1); // Remove the date from reserved array
            } else {
              times.push(new Date(startDate.getTime())); // Push a new Date object to times array
            }
          }
          startDate.setMinutes(startDate.getMinutes() + +time.sessionTime);
        }
        intervals.push({ day: startDate, freeTime: times });
      }
    });
  }

  return intervals;
};
