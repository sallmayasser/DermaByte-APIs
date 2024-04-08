const moment = require('moment');

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

exports.divideTimeRange = (reserved, schedule, currentDate) => {
  const intervals = [];
  // const currentDate = moment(); // Represents the current date
  const numDays = daysInMonth(currentDate.year(), currentDate.month());
  for (let day = moment(Date.now()).date(); day <= numDays; day += 1) {
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
