import './css/base.scss';
import './css/styles.scss';

// import userData from './data/users';
// import activityData from './data/activity';
// import sleepData from './data/sleep';
// import hydrationData from './data/hydration';

import UserRepository from './UserRepository';
import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import $ from 'jquery';

let userRepository;
let userData;
let sleepData;
let activityData;
let hydrationData;

userData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData')
  .then(data => data.json())
  .then(data => data.userData)
  .catch(error => console.log('userData error'))

sleepData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData')
  .then(data => data.json())
  .then(data => data.sleepData)
  .catch(error => console.log('sleepData error'))

activityData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData')
  .then(data => data.json())
  .then(data => data.activityData)
  .catch(error => console.log('activityData error'))

hydrationData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData')
  .then(data => data.json())
  .then(data => data.hydrationData)
  .catch(error => console.log('hydrationData error'))

Promise.all([userData, sleepData, activityData, hydrationData])
  .then(data => {
    userData = data[0];
    // console.log('userData', userData);
    sleepData = data[1];
    // console.log('sleepData', sleepData);
    activityData = data[2];
    hydrationData = data[3];
  })
  .then(() => {
    userRepository = new UserRepository();
    instantiateAllUsers();
    console.log('userrepo', userRepository.users[0]);
    instantiateAllUsersActivity();
    instantiateAllUsersHydration();
    instantiateAllUsersSleep();
  })
  .then(() => {
    let user = userRepository.users[Math.floor(Math.random() * userRepository.users.length)]
    let todayDate = "2019/09/22";
    user.findFriendsNames(userRepository.users);
    updateTrendingStairsDays(user);

    console.log('random user', user)
  })
  .catch(error => {console.log('Something is amiss with promise all', error)});


let instantiateAllUsers = () => {
  userData.forEach(user => {
    user = new User(user);
    userRepository.users.push(user)
  })
}

let instantiateAllUsersActivity = () => {
  activityData.forEach(activity => {
    activity = new Activity(activity, userRepository)
  })
};

let instantiateAllUsersHydration = () => {
  hydrationData.forEach(hydration => {
    hydration = new Hydration(hydration, userRepository);
  })
};

let instantiateAllUsersSleep = () => {
  sleepData.forEach(sleep => {
    sleep = new Sleep(sleep, userRepository);
  })
};

function onLoad() {
  generateRandomUser(userRepository)
  console.log(user[0]);
}

let generateRandomUser = (dataSet) => {
  dataSet.sort(() => Math.random() * 50)
  console.log(dataSet)
}

//next up//

// let sortedHydrationDataByDate = user.ouncesRecord.sort((a, b) => {
//   if (Object.keys(a)[0] > Object.keys(b)[0]) {
//     return -1;
//   }
//   if (Object.keys(a)[0] < Object.keys(b)[0]) {
//     return 1;
//   }
//   return 0;
// });

// let updateTrendingStairsDays = (user) => {
//   user.findTrendingStairsDays();
//   trendingStairsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStairsDays[0]}</p>`;
// }
//
// function updateTrendingStepDays() {
//   user.findTrendingStepDays();
//   trendingStepsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStepDays[0]}</p>`;
// }
//
// for (var i = 0; i < dailyOz.length; i++) {
//   dailyOz[i].innerText = user.addDailyOunces(Object.keys(sortedHydrationDataByDate[i])[0])
// }

// function postNewSleepData() {
//   fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         "userId": `${user-id-input}`,
//         "date": `${date-input}`,
//         "hoursSlept": `${hours-slept-input}`,
//         "sleepQuality": `${sleep-quality-input}`
//     })
//   })
// };
//
// function postNewActivityData() {
//   fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         "userId": `${user-id-input}`,
//         "date": `${date-input}`,
//         "numSteps": `${number-of-steps-input}`,
//         "minutesActive": `${minutes-active-input}`
//         "flightsOfStairs": `${flights-of-stairs-input}`
//     })
//   })
// };
//
// function postNewHydrationData() {
//   fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         "userId": `${user-id-input}`,
//         "date": `${date-input}`,
//         "numOunces": `${number-of-ounces-input}`
//
//     })
//   })
// };
//
//
// let dailyOz = document.querySelectorAll('.daily-oz');
let dailyOz = $('.daily-oz');
// let dropdownEmail = document.querySelector('#dropdown-email');
let dropdownEmail = $('#dropdown-email')
// let dropdownFriendsStepsContainer = document.querySelector('#dropdown-friends-steps-container');
let dropdownFriendsStepsContainer = $('#dropdown-friends-steps-container');
// let dropdownGoal = document.querySelector('#dropdown-goal');
let dropdownGoal = $('#dropdown-goal');
// let dropdownName = document.querySelector('#dropdown-name');
let dropdownName = $('#dropdown-name');
// let headerName = document.querySelector('#header-name');
let headerName = $('#header-name');
// let hydrationCalendarCard = document.querySelector('#hydration-calendar-card');
let hydrationCalendarCard = $('#hydration-calendar-card');
// let hydrationFriendOuncesToday = document.querySelector('#hydration-friend-ounces-today');
let hydrationFriendOuncesToday = $('#hydration-friend-ounces-today');
// let hydrationFriendsCard = document.querySelector('#hydration-friends-card');
let hydrationFriendsCard = $('#hydration-friends-card');
// let hydrationInfoCard = document.querySelector('#hydration-info-card');
let hydrationInfoCard = $('#hydration-info-card');
// let hydrationInfoGlassesToday = document.querySelector('#hydration-info-glasses-today');
let hydrationInfoGlassesToday = $('#hydration-info-glasses-today');
// let hydrationMainCard = document.querySelector('#hydration-main-card');
let hydrationMainCard = $('#hydration-main-card');
// let hydrationUserOuncesToday = document.querySelector('#hydration-user-ounces-today');
let hydrationUserOuncesToday = $('#hydration-user-ounces-today');
// let mainPage = document.querySelector('main');
let mainPage = $('main');
// let profileButton = document.querySelector('#profile-button');
let profileButton = $('#profile-button');
// let sleepCalendarCard = document.querySelector('#sleep-calendar-card');
let sleepCalendarCard = $('#sleep-calendar-card');
// let sleepCalendarHoursAverageWeekly = document.querySelector('#sleep-calendar-hours-average-weekly');
let sleepCalendarHoursAverageWeekly = $('#sleep-calendar-hours-average-weekly');
// let sleepCalendarQualityAverageWeekly = document.querySelector('#sleep-calendar-quality-average-weekly');
let sleepCalendarQualityAverageWeekly = $('#sleep-calendar-quality-average-weekly');
// let sleepFriendLongestSleeper = document.querySelector('#sleep-friend-longest-sleeper');
let sleepFriendLongestSleeper = $('#sleep-friend-longest-sleeper');
// let sleepFriendsCard = document.querySelector('#sleep-friends-card');
let sleepFriendsCard = $('#sleep-friends-card');
// let sleepFriendWorstSleeper = document.querySelector('#sleep-friend-worst-sleeper');
let sleepFriendWorstSleeper = $('#sleep-friend-worst-sleeper');
// let sleepInfoCard = document.querySelector('#sleep-info-card');
let sleepInfoCard = $('#sleep-info-card');
// let sleepInfoHoursAverageAlltime = document.querySelector('#sleep-info-hours-average-alltime');
let sleepInfoHoursAverageAlltime = $('#sleep-info-hours-average-alltime');
// let sleepInfoQualityAverageAlltime = document.querySelector('#sleep-info-quality-average-alltime');
let sleepInfoQualityAverageAlltime = $('#sleep-info-quality-average-alltime');
// let sleepInfoQualityToday = document.querySelector('#sleep-info-quality-today');
let sleepInfoQualityToday = $('#sleep-info-quality-today');
// let sleepMainCard = document.querySelector('#sleep-main-card');
let sleepMainCard = $('#sleep-main-card');
// let sleepUserHoursToday = document.querySelector('#sleep-user-hours-today');
let sleepUserHoursToday = $('#sleep-user-hours-today');
// let sortedHydrationDataByDate = user.ouncesRecord.sort((a, b) => {
//   if (Object.keys(a)[0] > Object.keys(b)[0]) {
//     return -1;
//   }
//   if (Object.keys(a)[0] < Object.keys(b)[0]) {
//     return 1;
//   }
//   return 0;
// });
// let stairsCalendarCard = document.querySelector('#stairs-calendar-card');
let stairsCalendarCard = $('#stairs-calendar-card');
// let stairsCalendarFlightsAverageWeekly = document.querySelector('#stairs-calendar-flights-average-weekly');
let stairsCalendarFlightsAverageWeekly = $('#stairs-calendar-flights-average-weekly');
// let stairsCalendarStairsAverageWeekly = document.querySelector('#stairs-calendar-stairs-average-weekly');
let stairsCalendarStairsAverageWeekly = $('#stairs-calendar-stairs-average-weekly');
// let stepsMainCard = document.querySelector('#steps-main-card');
let stepsMainCard = $('#steps-main-card');
// let stepsInfoCard = document.querySelector('#steps-info-card');
let stepsInfoCard = $('#steps-info-card');
// let stepsFriendsCard = document.querySelector('#steps-friends-card');
let stepsFriendsCard = $('#steps-friends-card');
// let stepsTrendingCard = document.querySelector('#steps-trending-card');
let stepsTrendingCard = $('#steps-trending-card');
// let stepsCalendarCard = document.querySelector('#steps-calendar-card');
let stepsCalendarCard = $('#steps-calendar-card');
let stairsFriendFlightsAverageToday = $('#stairs-friend-flights-average-today');
// let stairsFriendsCard = document.querySelector('#stairs-friends-card');
let stairsFriendsCard = $('#stairs-friends-card');
// let stairsInfoCard = document.querySelector('#stairs-info-card');
let stairsInfoCard = $('#stairs-info-card');
// let stairsInfoFlightsToday = document.querySelector('#stairs-info-flights-today');
let stairsInfoFlightsToday = $('#stairs-info-flights-today');
// let stairsMainCard = document.querySelector('#stairs-main-card');
let stairsMainCard = $('#stairs-main-card');
// let stairsTrendingButton = document.querySelector('.stairs-trending-button');
let stairsTrendingButton = $('.stairs-trending-button');
// let stairsTrendingCard = document.querySelector('#stairs-trending-card');
let stairsTrendingCard = $('#stairs-trending-card');
// let stairsUserStairsToday = document.querySelector('#stairs-user-stairs-today');
let stairsUserStairsToday = $('#stairs-user-stairs-today');
// let stepsCalendarTotalActiveMinutesWeekly = document.querySelector('#steps-calendar-total-active-minutes-weekly');
let stepsCalendarTotalActiveMinutesWeekly = $('#steps-calendar-total-active-minutes-weekly');
// let stepsCalendarTotalStepsWeekly = document.querySelector('#steps-calendar-total-steps-weekly');
let stepsCalendarTotalStepsWeekly = $('#steps-calendar-total-steps-weekly');
// let stepsFriendAverageStepGoal = document.querySelector('#steps-friend-average-step-goal');
let stepsFriendAverageStepGoal = $('#steps-friend-average-step-goal');
// let stepsInfoActiveMinutesToday = document.querySelector('#steps-info-active-minutes-today');
let stepsInfoActiveMinutesToday = $('#steps-info-active-minutes-today');
// let stepsInfoMilesWalkedToday = document.querySelector('#steps-info-miles-walked-today');
let stepsInfoMilesWalkedToday = $('#steps-info-miles-walked-today');
// let stepsFriendActiveMinutesAverageToday = document.querySelector('#steps-friend-active-minutes-average-today');
let stepsFriendActiveMinutesAverageToday = $('#steps-friend-active-minutes-average-today');
// let stepsFriendStepsAverageToday = document.querySelector('#steps-friend-steps-average-today');
let stepsFriendStepsAverageToday = $('#steps-friend-steps-average-today');
// let stepsTrendingButton = document.querySelector('.steps-trending-button');
let stepsTrendingButton = $('.steps-trending-button');
// let stepsUserStepsToday = document.querySelector('#steps-user-steps-today');
let stepsUserStepsToday = $('#steps-user-steps-today');
// let trendingStepsPhraseContainer = document.querySelector('.trending-steps-phrase-container');
let trendingStepsPhraseContainer = $('.trending-steps-phrase-container');
// let trendingStairsPhraseContainer = document.querySelector('.trending-stairs-phrase-container');
let trendingStairsPhraseContainer = $('.trending-stairs-phrase-container');
// let userInfoDropdown = document.querySelector('#user-info-dropdown');
let userInfoDropdown = $('#user-info-dropdown');
//
// mainPage.addEventListener('click', showInfo);
// profileButton.addEventListener('click', showDropdown);
// stairsTrendingButton.addEventListener('click', updateTrendingStairsDays());
// stepsTrendingButton.addEventListener('click', updateTrendingStepDays());
//
// function flipCard(cardToHide, cardToShow) {
//   cardToHide.classList.add('hide');
//   cardToShow.classList.remove('hide');
// }
//
// function showDropdown() {
//   userInfoDropdown.classList.toggle('hide');
// }
//
// function showInfo() {
//   if (event.target.classList.contains('steps-info-button')) {
//     flipCard(stepsMainCard, stepsInfoCard);
//   }
//   if (event.target.classList.contains('steps-friends-button')) {
//     flipCard(stepsMainCard, stepsFriendsCard);
//   }
//   if (event.target.classList.contains('steps-trending-button')) {
//     flipCard(stepsMainCard, stepsTrendingCard);
//   }
//   if (event.target.classList.contains('steps-calendar-button')) {
//     flipCard(stepsMainCard, stepsCalendarCard);
//   }
//   if (event.target.classList.contains('hydration-info-button')) {
//     flipCard(hydrationMainCard, hydrationInfoCard);
//   }
//   if (event.target.classList.contains('hydration-friends-button')) {
//     flipCard(hydrationMainCard, hydrationFriendsCard);
//   }
//   if (event.target.classList.contains('hydration-calendar-button')) {
//     flipCard(hydrationMainCard, hydrationCalendarCard);
//   }
//   if (event.target.classList.contains('stairs-info-button')) {
//     flipCard(stairsMainCard, stairsInfoCard);
//   }
//   if (event.target.classList.contains('stairs-friends-button')) {
//     flipCard(stairsMainCard, stairsFriendsCard);
//   }
//   if (event.target.classList.contains('stairs-trending-button')) {
//     flipCard(stairsMainCard, stairsTrendingCard);
//   }
//   if (event.target.classList.contains('stairs-calendar-button')) {
//     flipCard(stairsMainCard, stairsCalendarCard);
//   }
//   if (event.target.classList.contains('sleep-info-button')) {
//     flipCard(sleepMainCard, sleepInfoCard);
//   }
//   if (event.target.classList.contains('sleep-friends-button')) {
//     flipCard(sleepMainCard, sleepFriendsCard);
//   }
//   if (event.target.classList.contains('sleep-calendar-button')) {
//     flipCard(sleepMainCard, sleepCalendarCard);
//   }
//   if (event.target.classList.contains('steps-go-back-button')) {
//     flipCard(event.target.parentNode, stepsMainCard);
//   }
//   if (event.target.classList.contains('hydration-go-back-button')) {
//     flipCard(event.target.parentNode, hydrationMainCard);
//   }
//   if (event.target.classList.contains('stairs-go-back-button')) {
//     flipCard(event.target.parentNode, stairsMainCard);
//   }
//   if (event.target.classList.contains('sleep-go-back-button')) {
//     flipCard(event.target.parentNode, sleepMainCard);
//   }
// }
//
// function updateTrendingStairsDays() {
//   user.findTrendingStairsDays();
//   trendingStairsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStairsDays[0]}</p>`;
// }
//
// function updateTrendingStepDays() {
//   user.findTrendingStepDays();
//   trendingStepsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStepDays[0]}</p>`;
// }
//
// for (var i = 0; i < dailyOz.length; i++) {
//   dailyOz[i].innerText = user.addDailyOunces(Object.keys(sortedHydrationDataByDate[i])[0])
// }
//
// dropdownGoal.innerText = `DAILY STEP GOAL | ${user.dailyStepGoal}`;
//
// dropdownEmail.innerText = `EMAIL | ${user.email}`;
//
// dropdownName.innerText = user.name.toUpperCase();
//
// headerName.innerText = `${user.getFirstName()}'S `;
//
// hydrationUserOuncesToday.innerText = hydrationData.find(hydration => {
//   return hydration.userID === user.id && hydration.date === todayDate;
// }).numOunces;
//
// hydrationFriendOuncesToday.innerText = userRepository.calculateAverageDailyWater(todayDate);
//
// hydrationInfoGlassesToday.innerText = hydrationData.find(hydration => {
//   return hydration.userID === user.id && hydration.date === todayDate;
// }).numOunces / 8;
//
// sleepCalendarHoursAverageWeekly.innerText = user.calculateAverageHoursThisWeek(todayDate);
//
// sleepCalendarQualityAverageWeekly.innerText = user.calculateAverageQualityThisWeek(todayDate);
//
// sleepFriendLongestSleeper.innerText = userRepository.users.find(user => {
//   return user.id === userRepository.getLongestSleepers(todayDate)
// }).getFirstName();
//
// sleepFriendWorstSleeper.innerText = userRepository.users.find(user => {
//   return user.id === userRepository.getWorstSleepers(todayDate)
// }).getFirstName();
//
// sleepInfoHoursAverageAlltime.innerText = user.hoursSleptAverage;
//
// stepsInfoMilesWalkedToday.innerText = user.activityRecord.find(activity => {
//   return (activity.date === todayDate && activity.userId === user.id)
// }).calculateMiles(userRepository);
//
// sleepInfoQualityAverageAlltime.innerText = user.sleepQualityAverage;
//
// sleepInfoQualityToday.innerText = sleepData.find(sleep => {
//   return sleep.userID === user.id && sleep.date === todayDate;
// }).sleepQuality;
//
// sleepUserHoursToday.innerText = sleepData.find(sleep => {
//   return sleep.userID === user.id && sleep.date === todayDate;
// }).hoursSlept;
//
// stairsCalendarFlightsAverageWeekly.innerText = user.calculateAverageFlightsThisWeek(todayDate);
//
// stairsCalendarStairsAverageWeekly.innerText = (user.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0);
//
// stairsFriendFlightsAverageToday.innerText = (userRepository.calculateAverageStairs(todayDate) / 12).toFixed(1);
//
// stairsInfoFlightsToday.innerText = activityData.find(activity => {
//   return activity.userID === user.id && activity.date === todayDate;
// }).flightsOfStairs;
//
// stairsUserStairsToday.innerText = activityData.find(activity => {
//   return activity.userID === user.id && activity.date === todayDate;
// }).flightsOfStairs * 12;
//
// stairsCalendarFlightsAverageWeekly.innerText = user.calculateAverageFlightsThisWeek(todayDate);
//
// stairsCalendarStairsAverageWeekly.innerText = (user.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0);
//
// stairsTrendingButton.addEventListener('click', function() {
//   user.findTrendingStairsDays();
//   trendingStairsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStairsDays[0]}</p>`;
// });
//
// stepsCalendarTotalActiveMinutesWeekly.innerText = user.calculateAverageMinutesActiveThisWeek(todayDate);
//
// stepsCalendarTotalStepsWeekly.innerText = user.calculateAverageStepsThisWeek(todayDate);
//
// stepsTrendingButton.addEventListener('click', function() {
//   user.findTrendingStepDays();
//   trendingStepsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStepDays[0]}</p>`;
// });
//
// stepsFriendActiveMinutesAverageToday.innerText = userRepository.calculateAverageMinutesActive(todayDate);
//
// stepsFriendAverageStepGoal.innerText = `${userRepository.calculateAverageStepGoal()}`;
//
// stepsFriendStepsAverageToday.innerText = userRepository.calculateAverageSteps(todayDate);
//
// stepsInfoActiveMinutesToday.innerText = activityData.find(activity => {
//   return activity.userID === user.id && activity.date === todayDate;
// }).minutesActive;
//
// stepsUserStepsToday.innerText = activityData.find(activity => {
//   return activity.userID === user.id && activity.date === todayDate;
// }).numSteps;
//
// user.findFriendsTotalStepsForWeek(userRepository.users, todayDate);
//
// user.friendsActivityRecords.forEach(friend => {
//   dropdownFriendsStepsContainer.innerHTML += `
//   <p class='dropdown-p friends-steps'>${friend.firstName} |  ${friend.totalWeeklySteps}</p>
//   `;
// });
//
// let friendsStepsParagraphs = document.querySelectorAll('.friends-steps');
//
// friendsStepsParagraphs.forEach(paragraph => {
//   if (friendsStepsParagraphs[0] === paragraph) {
//     paragraph.classList.add('green-text');
//   }
//   if (friendsStepsParagraphs[friendsStepsParagraphs.length - 1] === paragraph) {
//     paragraph.classList.add('red-text');
//   }
//   if (paragraph.innerText.includes('YOU')) {
//     paragraph.classList.add('yellow-text');
//   }
// });
