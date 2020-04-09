// IMPORTS
import './css/base.scss';
import './css/styles.scss';
import UserRepository from './UserRepository';
import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import $ from 'jquery';

// GLOBALS
let userRepository;
let userData;
let sleepData;
let activityData;
let hydrationData;

// FETCHING
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

// PROMISE
Promise.all([userData, sleepData, activityData, hydrationData])
  .then(data => {
    userData = data[0];
    sleepData = data[1];
    activityData = data[2];
    hydrationData = data[3];
  })
  .then(() => {
    userRepository = new UserRepository(userData, sleepData, activityData, hydrationData);
    instantiateAllUsers();
    instantiateAllUsersActivity();
    instantiateAllUsersHydration();
    instantiateAllUsersSleep();
  })
  .then(() => {
    let user = userRepository.users[Math.floor(Math.random() * userRepository.users.length)]
    let todayDate = "2020/01/22";
    console.log(user);
    user.findFriendsNames(userRepository.users);
    updateTrendingStairsDays(user);
    updateTrendingStepDays(user);
    displayFriendsTotalSteps(user, todayDate);
    displayUserInfo(user, todayDate);
    // sortedHydrationDataByDate(user);
  })
  .catch(error => {
    console.log('Something is amiss with promise all', error)
  });

// INSTANTIATION
let instantiateAllUsers = () => {
  userData.forEach(user => {
    user = new User(user);
    userRepository.users.push(user)
  })
};

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
};

let generateRandomUser = (dataSet) => {
  dataSet.sort(() => Math.random() * 50)
};

// EVENTS
$('#steps-card-container').on('click', (event) => stepsButtonHandler());
$('#hydration-card-container').on('click', (event) => hydrationButtonHandler());
$('#stairs-card-container').on('click', (event) => stairsButtonHandler());
$('#sleep-card-container').on('click', (event) => sleepButtonHandler());
$('#profile-button').on('click', (event) => showDropdown());
$('.stairs-trending-button').on('click', (event) => updateTrendingStairsDays)
$('.steps-trending-button').on('click', (event) => updateTrendingStepDays)

function flipCard(cardToHide, cardToShow) {
  $(cardToHide).addClass('hide');
  $(cardToShow).removeClass('hide')
}

function showDropdown() {
  $('#user-info-dropdown').toggle('hide');
};

// EVENT HANDLERS
function stepsButtonHandler() {
  if ($(event.target).hasClass('steps-info-button')) {
    flipCard($('#steps-main-card'), $('#steps-info-card'));
  }
  if ($(event.target).hasClass('steps-friends-button')) {
    flipCard($('#steps-main-card'), $('#steps-friends-card'));
  }
  if ($(event.target).hasClass('steps-trending-button')) {
    flipCard($('#steps-main-card'), $('#steps-trending-card'));
  }
  if ($(event.target).hasClass('steps-calendar-button')) {
    flipCard($('#steps-main-card'), $('#steps-calendar-card'));
  }
  if ($(event.target).hasClass('steps-go-back-button')) {
    flipCard(event.target.parentNode, $('#steps-main-card'));
  }
};

function stairsButtonHandler() {
  if ($(event.target).hasClass('stairs-info-button')) {
    flipCard($('#stairs-main-card'), $('#stairs-info-card'));
  }
  if ($(event.target).hasClass('stairs-friends-button')) {
    flipCard($('#stairs-main-card'), $('#stairs-friends-card'));
  }
  if ($(event.target).hasClass('stairs-trending-button')) {
    flipCard($('#stairs-main-card'), $('#stairs-trending-card'));
  }
  if ($(event.target).hasClass('stairs-calendar-button')) {
    flipCard($('#stairs-main-card'), $('#stairs-calendar-card'));
  }
  if ($(event.target).hasClass('stairs-go-back-button')) {
    flipCard(event.target.parentNode, $('#stairs-main-card'));
  }
};

function hydrationButtonHandler() {
  if ($(event.target).hasClass('hydration-info-button')) {
    flipCard($('#hydration-main-card'), $('#hydration-info-card'));
  }
  if ($(event.target).hasClass('hydration-friends-button')) {
    flipCard($('#hydration-main-card'), $('#hydration-friends-card'));
  }
  if ($(event.target).hasClass('hydration-calendar-button')) {
    flipCard($('#hydration-main-card'), $('#hydration-calendar-card'));
  }
  if ($(event.target).hasClass('hydration-go-back-button')) {
    flipCard(event.target.parentNode, $('#hydration-main-card'));
  }
};

function sleepButtonHandler() {
  if ($(event.target).hasClass('sleep-info-button')) {
    flipCard($('#sleep-main-card'), $('#sleep-info-card'));
  }
  if ($(event.target).hasClass('sleep-friends-button')) {
    flipCard($('#sleep-main-card'), $('#sleep-friends-card'));
  }
  if ($(event.target).hasClass('sleep-calendar-button')) {
    flipCard($('#sleep-main-card'), $('#sleep-calendar-card'));
  }
  if ($(event.target).hasClass('sleep-go-back-button')) {
    flipCard(event.target.parentNode, $('#sleep-main-card'));
  }
};

let updateTrendingStairsDays = (user) => {
  user.findTrendingStairsDays();
  $('.trending-stairs-phrase-container').html(`<p class='trend-line'>${user.trendingStairsDays[0]}</p>`);
};

let updateTrendingStepDays = (user) => {
  user.findTrendingStepDays();
  $('.trending-steps-phrase-container').html(`<p class='trend-line'>${user.trendingStepDays[0]}</p>`);
};

let displayFriendsTotalSteps = (user, todayDate) => {
  user.findFriendsTotalStepsForWeek(userRepository.users, todayDate);
  user.friendsActivityRecords.forEach(friend => {
    $('#dropdown-friends-steps-container').append(`
    <p class='dropdown-p friends-steps'>${friend.firstName} |  ${friend.totalWeeklySteps}</p>
    `);
  });
};

let displayUserInfo = (user, todayDate) => {
  displayDropdownInfo(user);
  displayStepsData(user, todayDate);
  displayStairsData(user, todayDate);
  displayHydrationData(user, todayDate);
  displaySleepData(user, todayDate);
};

function displayDropdownInfo(user) {
  $('#dropdown-goal').text(`DAILY STEP GOAL | ${user.dailyStepGoal}`);
  $('#dropdown-email').text(`EMAIL | ${user.email}`);
  $('#dropdown-name').text(user.name.toUpperCase());
  $('#header-name').text(`${user.getFirstName()}'S `);
};

function displayStepsData(user, todayDate) {
  $('#steps-info-miles-walked-today').text(user.activityRecord.find(activity => {
    return (activity.date === todayDate && activity.userId === user.id)
  }).calculateMiles(userRepository));
  $('#steps-calendar-total-active-minutes-weekly').text(user.calculateAverageMinutesActiveThisWeek(todayDate));
  $('#steps-calendar-total-steps-weekly').text(user.calculateAverageStepsThisWeek(todayDate))
  $('#steps-friend-active-minutes-average-today').text(userRepository.calculateAverageMinutesActive(todayDate));
  $('#steps-friend-average-step-goal').text(`${userRepository.calculateAverageStepGoal()}`);
  $('#steps-friend-steps-average-today').text(userRepository.calculateAverageSteps(todayDate));
  $('#steps-info-active-minutes-today').text(activityData.find(activity => {
    return activity.userID === user.id && activity.date === todayDate
  }).minutesActive);
  $('#steps-user-steps-today').text(activityData.find(activity => {
    return activity.userID === user.id && activity.date === todayDate
  }).numSteps);
};

function displayStairsData(user, todayDate) {
  $('#stairs-calendar-flights-average-weekly').text(user.calculateAverageFlightsThisWeek(todayDate));
  $('#stairs-calendar-stairs-average-weekly').text((user.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0));
  $('#stairs-friend-flights-average-today').text((userRepository.calculateAverageStairs(todayDate) / 12).toFixed(1));
  $('#stairs-info-flights-today').text(activityData.find(activity => {
    return activity.userID === user.id && activity.date === todayDate
  }).flightsOfStairs);
  $('#stairs-user-stairs-today').text(activityData.find(activity => {
    return activity.userID === user.id && activity.date === todayDate
  }).flightsOfStairs * 12);
};

function displayHydrationData(user, todayDate) {
  $('#hydration-user-ounces-today').text(hydrationData.find(hydration => {
    return hydration.userID === user.id && hydration.date === todayDate
  }).numOunces);
  $('#hydration-friend-ounces-today').text(userRepository.calculateAverageDailyWater(todayDate));
  $('#hydration-info-glasses-today').text(hydrationData.find(hydration => {
    return hydration.userID === user.id && hydration.date === todayDate
  }).numOunces / 8);
};

function displaySleepData(user, todayDate) {
  $('#sleep-calendar-hours-average-weekly').text(user.calculateAverageHoursThisWeek(todayDate));
  $('#sleep-calendar-quality-average-weekly').text(user.calculateAverageQualityThisWeek(todayDate));
  $('#sleep-friend-longest-sleeper').text(userRepository.users.find(user => {
    return user.id === userRepository.getLongestSleepers(todayDate)
  }).getFirstName());
  $('#sleep-friend-worst-sleeper').text(userRepository.users.find(user => {
    return user.id === userRepository.getWorstSleepers(todayDate)
  }).getFirstName());
  $('#sleep-info-hours-average-alltime').text(user.hoursSleptAverage);
  $('#sleep-info-quality-average-alltime').text(user.sleepQualityAverage);
  $('#sleep-info-quality-today').text(sleepData.find(sleep => {
    return sleep.userID === user.id && sleep.date === todayDate
  }).sleepQuality);
  $('#sleep-user-hours-today').text(sleepData.find(sleep => {
    return sleep.userID === user.id && sleep.date === todayDate
  }).hoursSlept);
};
// 1 WEEK LEFT CHECKLIST:
  // [ ] Date data (find out wtf is going on here)
      // [ ] Down the road: working with data up to 1/22
      // or working with more recent data?
  // [ ] POSTing:
      // [ ] Already written out by Karl - flesh it out
      // [X] DOM element for user input
          // [X] One main input with dropdown menu for different activites
      // [ ] How to populate newly posted data
  // [ ] Refactor / consider each method in every class:
      // [ ] Employ arguemnts and parameters for changing behaviors
      // [ ] Make sure they are in places we want them to live
  // [X] Break up two main giant handlers:
      // [X] showInfo() --> maybe rename buttonHandler() and break up into:
          // [X] stepButtonHandler()
          // [X] stairButtonHandler()
          // [X] sleepButtonHandler()
          // [X] hydrationButtonHandler()
      // [X] displayUserInfo():
          // [X] displayGeneralUserInfo()
          // [X] displayStairData()
          // [X] displayStepData()
          // [X] displayHydrationData()
          // [X] displaySleepData()
  // [ ] SCSS
      // [ ] _index.scss (holds all imports)
      // [ ] _variables.scss (holds all variables)
      // [ ] other scss files for breaking up main styling?
  // [ ] Testing with SPIES
      // [X] Lesson tomorrow
      // [ ] Get initial tests passing 
      // [ ] Refactor DOM manipulation into methods on an object
      // [ ] Spy on all DOM manipulation methods to verify that they
      // [ ] occurred and were called with the correct arguments
      // [ ] Use an afterEach hook to clean up spies in between tests
  // [ ] Testing Firefox and Safari
  // [ ] Mobile design: should work for all different screen sizes
      // [ ] Mobile
      // [ ] Tablets
      // [ ] Desk monitors
  // [ ] Accessibility
      // [ ] Tab through app and use it with a mouse
      // [ ] Must be viewable through color-blind extension
      // [ ] Use Accessibility Audit to get close to a score of 100%

// THINGS TO ADDRESS

// let sortedHydrationDataByDate = user.ouncesRecord.sort((a, b) => {
//   if (Object.keys(a)[0] > Object.keys(b)[0]) {
//     return -1;
//   }
//   if (Object.keys(a)[0] < Object.keys(b)[0]) {
//     return 1;
//   }
//   return 0;
// });

//
// for (var i = 0; i < dailyOz.length; i++) {
//   dailyOz[i].innerText = user.addDailyOunces(Object.keys(sortedHydrationDataByDate[i])[0])
// }

// let sortedHydrationDataByDate = user.ouncesRecord.sort((a, b) => {
//   if (Object.keys(a)[0] > Object.keys(b)[0]) {
//     return -1;
//   }
//   if (Object.keys(a)[0] < Object.keys(b)[0]) {
//     return 1;
//   }
//   return 0;
// });
//
// let weeklyHydrationDataArray = sortedHydrationDataByDate.splice(0, 7);
// //Refactor this into a forEach
// for (var i = 0; i < $('.daily-oz').length; i++) {
//   $('.daily-oz')[i].text(user.addDailyOunces(Object.keys(sortedHydrationDataByDate[i])[0]))
// };
// //splice sortedHydrationDataByDate to get most recent 7 entires
// //loop through the first 7 entries and populate the oz per day

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
// let dailyOz = $('.daily-oz');
// let sortedHydrationDataByDate = user.ouncesRecord.sort((a, b) => {
//   if (Object.keys(a)[0] > Object.keys(b)[0]) {
//     return -1;
//   }
//   if (Object.keys(a)[0] < Object.keys(b)[0]) {
//     return 1;
//   }
//   return 0;
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
