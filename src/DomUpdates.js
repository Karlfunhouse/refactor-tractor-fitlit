import $ from 'jquery';
import UserRepository from '../src/UserRepository';
import User from '../src/User';
import Sleep from '../src/Sleep';
import Activity from '../src/Activity';
import Hydration from '../src/Hydration';
let dailyOz = document.querySelectorAll('.daily-oz');
let dailyOzArray = Array.from(dailyOz);
console.log('array', dailyOzArray)
export const domUpdates = {

loadUserData() {
  console.log('shit works!');
},

flipCard(cardToHide, cardToShow) {
  $(cardToHide).addClass('hide');
  $(cardToShow).removeClass('hide')
},

showUserDropdown() {
  $('#user-info-dropdown').toggle('hide');
},

showActivityDropdown() {
  $('#add-data-dropdown').toggle('hide');
},

updateTrendingStairsDays(user) {
  user.findTrendingStairsDays();
  $('.trending-stairs-phrase-container').html(`<p class='trend-line'>${user.trendingStairsDays[0]}</p>`);
},

updateTrendingStepDays(user) {
  user.findTrendingStepDays();
  $('.trending-steps-phrase-container').html(`<p class='trend-line'>${user.trendingStepDays[0]}</p>`);
},

displayFriendsTotalSteps(user, todayDate, userRepository) {
  user.findFriendsTotalStepsForWeek(userRepository.users, todayDate);
  user.friendsActivityRecords.forEach(friend => {
    $('#dropdown-friends-steps-container').append(`
    <p class='dropdown-p friends-steps'>${friend.firstName} |  ${friend.totalWeeklySteps}</p>
    `);
  });
},

displayWeeklyHydrationData() {

},

displayUserInfo(user, todayDate, userRepository, activityData, hydrationData, sleepData) {
  this.displayDropdownInfo(user);
  this.displayStepsData(user, todayDate, userRepository, activityData);
  this.displayStairsData(user, todayDate, userRepository, activityData);
  this.displayHydrationData(user, todayDate, userRepository, hydrationData);
  this.displaySleepData(user, todayDate, userRepository, sleepData);

},

displayStepsData(user, todayDate, userRepository, activityData) {
  //displayMilkesWalkedToday()
  //** NOT IN START APPLICATION**
  $('#steps-info-miles-walked-today').text(user.activityRecord.find(activity => {
    return (activity.date === todayDate && activity.userId === user.id)
  }).calculateMiles(userRepository));

  //displayAverageMinutesActiveThisWeek()
  $('#steps-calendar-total-active-minutes-weekly').text(user.calculateAverageMinutesActiveThisWeek(todayDate));

  //displayTotalStepsThisWeek()
  $('#steps-calendar-total-steps-weekly').text(user.calculateAverageStepsThisWeek(todayDate));

  //displayAllActiveMinutesToday()
  $('#steps-friend-active-minutes-average-today').text(userRepository.calculateAverageMinutesActive(todayDate));

  //displayAllAverageStepGoal()
  $('#steps-friend-average-step-goal').text(`${userRepository.calculateAverageStepGoal()}`);

  //displayAllAverageStepsToday()
  $('#steps-friend-steps-average-today').text(userRepository.calculateAverageSteps(todayDate));

  //displayAverageMinutesActiveToday()
  // ** NOT IN START APPLICATION**
  $('#steps-info-active-minutes-today').text(activityData.find(activity => {
    return activity.userID === user.id && activity.date === todayDate
  }).minutesActive);

  //displayTotalStepsToday()
  // ** NOT IN START APPLICATION**
  $('#steps-user-steps-today').text(activityData.find(activity => {
    return activity.userID === user.id && activity.date === todayDate
  }).numSteps);
},

displayStairsData(user, todayDate, userRepository, activityData) {
  //displayAverageFlightsThisWeek()
  $('#stairs-calendar-flights-average-weekly').text(user.calculateAverageFlightsThisWeek(todayDate));

  //displayAverageStairsThisWeek()
  $('#stairs-calendar-stairs-average-weekly').text((user.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0));

  //displayAllAverageFlightsToday()
  $('#stairs-friend-flights-average-today').text((userRepository.calculateAverageStairs(todayDate) / 12).toFixed(1));

  //displayTotalFlightsToday()
  // ** NOT IN START APPLICATION**
  $('#stairs-info-flights-today').text(activityData.find(activity => {
    return activity.userID === user.id && activity.date === todayDate
  }).flightsOfStairs);

  //displayTotalStairsToday()
  ** NOT IN START APPLICATION**
  $('#stairs-user-stairs-today').text(activityData.find(activity => {
    return activity.userID === user.id && activity.date === todayDate
  }).flightsOfStairs * 12);
},

displayHydrationData(user, todayDate, userRepository, hydrationData) {
  //displayTotalOuncesToday()
  // ** NOT IN START APPLICATION**
  $('#hydration-user-ounces-today').text(hydrationData.find(hydration => {
    return hydration.userID === user.id && hydration.date === todayDate
  }).numOunces);

  //displayAllAverageOuncesToday
  $('#hydration-friend-ounces-today').text(userRepository.calculateAverageDailyWater(todayDate));

  //displayTotalGlassesToday()
  // ** NOT IN START APPLICATION**
  $('#hydration-info-glasses-today').text(hydrationData.find(hydration => {
    return hydration.userID === user.id && hydration.date === todayDate
  }).numOunces / 8);
  // this.sortedHydrationDataByDate(user)
  this.displayDailyOzs(user);
},

displaySleepData(user, todayDate, userRepository, sleepData) {
  //displayUserId()
  //METHODS, JUST DISPLAY
  $('.user-id-js').text(`${user.id}`);

  //displayAverageHourlySleepThisWeek()
  $('#sleep-calendar-hours-average-weekly').text(user.calculateAverageHoursThisWeek(todayDate));

  //displayAverageSleepQualityThisWeek()
  $('#sleep-calendar-quality-average-weekly').text(user.calculateAverageQualityThisWeek(todayDate));

  //displayLongestSleeper()
  // ** NOT IN START APPLICATION**
  $('#sleep-friend-longest-sleeper').text(userRepository.users.find(user => {
    return user.id === userRepository.getLongestSleepers(todayDate)
  }).getFirstName());

  //displayWorstSleeper()
  // ** NOT IN START APPLICATION**
  $('#sleep-friend-worst-sleeper').text(userRepository.users.find(user => {
    return user.id === userRepository.getWorstSleepers(todayDate)
  }).getFirstName());

  //displayOverallSleepHoursAllTime()
  //NO METHODS, JUST DISPLAY
  $('#sleep-info-hours-average-alltime').text(user.hoursSleptAverage);

  //displayOverallSleepQualityAllTime()
  //NO METHODS, JUST DISPLAY
  $('#sleep-info-quality-average-alltime').text(user.sleepQualityAverage);

  //displaySleepQualityToday()
  // ** NOT IN START APPLICATION**
  $('#sleep-info-quality-today').text(sleepData.find(sleep => {
    return sleep.userID === user.id && sleep.date === todayDate
  }).sleepQuality);

  //displayHoursSleepToday()
  // ** NOT IN START APPLICATION**
  $('#sleep-user-hours-today').text(sleepData.find(sleep => {
    return sleep.userID === user.id && sleep.date === todayDate
  }).hoursSlept);
},


displayDropdownInfo(user) {
  // NO METHODS, JUST DISPLAY
  $('#dropdown-goal').text(`DAILY STEP GOAL | ${user.dailyStepGoal}`);
  $('#dropdown-email').text(`EMAIL | ${user.email}`);
  $('#dropdown-name').text(user.name.toUpperCase());
  $('#header-name').text(`${user.getFirstName()}'S `);
},


displayDailyOzs(user) {
  // FUCK THIS METHOD
  let weeklyOzs = user.ouncesRecord.slice(1, 7);
  let weekData = [];
  weeklyOzs.forEach(day => {
    weekData.push(Object.values(day))
  })
  weekData.flat().map(data => {
    dailyOzArray.forEach(element => {
      element.innerText = data;
    })
  })
},

// sortedHydrationDataByDate(user) {
//   console.log('ouncesRecord', user.ouncesRecord.slice(1, 7));
// },
// displayDailyOzs(user) {
//   console.log('oz', $('.daily-oz'))
//   let weeklyOzs = user.ouncesRecord.slice(1, 7)
//   let weekData = [];
//   let week = weeklyOzs.forEach(day => {
//     weekData.push(Object.values(day))
//   })
//   let blah = dailyOzArray.map(element => {
//     weekData.forEach(data => {
//       element.innerText = data;
//     })
//   })
//   return blah;
//   // weekData.flat().forEach(value => {
//   // $('.daily-oz').html(`<h4 class='hydration-weekly-amount'><span class='daily-oz' id='hydration-calendar-ounces-1day'></span>${value}</h4>`)
//
// // let maybe = weekData.flat().reduce((acc, value) => {
// //   // console.log(weekData[value]);
// //   acc += `<h4 class='hydration-weekly-amount'><span class='daily-oz' id='hydration-calendar-ounces-1day'></span>${value}</h4>`
// //   console.log(acc);
// //   return acc
// // }, [])
// },

}

export default domUpdates;
