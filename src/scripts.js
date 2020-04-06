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

// We need to somehow make sure that we have access to all
// of the methods in every class. So when we call hydration.Method(),
// it knows what hydration is and that it's supposed to reach
// into that class and execute a method from there.

Promise.all([userData, sleepData, activityData, hydrationData])
  .then(data => {
    userData = data[0];
    sleepData = data[1];
    activityData = data[2];
    hydrationData = data[3];
  })
  .then(() => {
    userRepository = new UserRepository();
    instantiateAllUsers();
    instantiateAllUsersActivity();
    instantiateAllUsersHydration();
    instantiateAllUsersSleep();
  })
  .then(() => {
    let user = userRepository.users[Math.floor(Math.random() * userRepository.users.length)]
    let todayDate = "2019/09/22";
    user.findFriendsNames(userRepository.users);
    updateTrendingStairsDays(user);
    updateTrendingStepDays(user);

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
//   trendingStairsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStairsDays[0]}</p>`
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
let dropdownFriendsStepsContainer = $('#dropdown-friends-steps-container');
// let sortedHydrationDataByDate = user.ouncesRecord.sort((a, b) => {
//   if (Object.keys(a)[0] > Object.keys(b)[0]) {
//     return -1;
//   }
//   if (Object.keys(a)[0] < Object.keys(b)[0]) {
//     return 1;
//   }
//   return 0;
// });

$('main').on('click', (event) => showInfo());
$('#profile-button').on('click', (event) => showDropdown());
$('.stairs-trending-button').on('click', (event) => updateTrendingStairsDays)
$('.steps-trending-button').on('click', (event) => updateTrendingStepDays)

function flipCard(cardToHide, cardToShow) {
  $(cardToHide).addClass('hide');
  $(cardToShow).removeClass('hide')
}

function showDropdown() {
  $('#user-info-dropdown').toggle('hide');
}

// Maybe try to break up this handler into four separate handlers
// Steps, stairs, hydration, and sleep. To do this we'd likely
// have to create four different jQuery event listeners,
// so unsure which option is better.
function showInfo() {
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
  if ($(event.target).hasClass('hydration-info-button')) {
    flipCard($('#hydration-main-card'), $('#hydration-info-card'));
  }
  if ($(event.target).hasClass('hydration-friends-button')) {
    flipCard($('#hydration-main-card'), $('#hydration-friends-card'));
  }
  if ($(event.target).hasClass('hydration-calendar-button')) {
    flipCard($('#hydration-main-card'), $('#hydration-calendar-card'));
  }
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
  if ($(event.target).hasClass('sleep-info-button')) {
    flipCard($('#sleep-main-card'), $('#sleep-info-card'));
  }
  if ($(event.target).hasClass('sleep-friends-button')) {
    flipCard($('#sleep-main-card'), $('#sleep-friends-card'));
  }
  if ($(event.target).hasClass('sleep-calendar-button')) {
    flipCard($('#sleep-main-card'), $('#sleep-calendar-card'));
  }
  if ($(event.target).hasClass('steps-go-back-button')) {
    flipCard(event.target.parentNode, $('#steps-main-card'));
  }
  if ($(event.target).hasClass('hydration-go-back-button')) {
    flipCard(event.target.parentNode, $('#hydration-main-card'));
  }
  if ($(event.target).hasClass('stairs-go-back-button')) {
    flipCard(event.target.parentNode, $('#stairs-main-card'));
  }
  if ($(event.target).hasClass('sleep-go-back-button')) {
    flipCard(event.target.parentNode, $('#sleep-main-card'));
  }
}

let updateTrendingStairsDays = (user) => {
  user.findTrendingStairsDays();
  $('.trending-stairs-phrase-container').html(`<p class='trend-line'>${user.trendingStairsDays[0]}</p>`);
}

let updateTrendingStepDays = (user) => {
  user.findTrendingStepDays();
  $('.trending-steps-phrase-container').html(`<p class='trend-line'>${user.trendingStepDays[0]}</p>`);
}
//
// for (var i = 0; i < dailyOz.length; i++) {
//   dailyOz[i].innerText = user.addDailyOunces(Object.keys(sortedHydrationDataByDate[i])[0])
// }
//

// Maybe create a parent / handler function called 'displayUserInfo()' that is
// called in the promise and does ALL of the below text insertions.

$('#dropdown-goal').text(`DAILY STEP GOAL | ${user.dailyStepGoal}`)

$('#dropdown-email').text(`EMAIL | ${user.email}`)

$('#dropdown-name').text(user.name.toUpperCase());

$('#header-name').text(`${user.getFirstName()}'S `);

$('#hydration-user-ounces-today').text(hydrationData.find(hydration => {
  return hydration.userID === user.id && hydration.date === todayDate}).numOunces);

$('#hydration-friend-ounces-today').text(userRepository.calculateAverageDailyWater(todayDate));

$('#hydration-info-glasses-today').text(hydrationData.find(hydration => {
  return hydration.userID === user.id && hydration.date === todayDate}).numOunces / 8);

$('#sleep-calendar-hours-average-weekly').text(user.calculateAverageHoursThisWeek(todayDate));

$('#sleep-calendar-quality-average-weekly').text(user.calculateAverageQualityThisWeek(todayDate));

$('#sleep-friend-longest-sleeper').text(userRepository.users.find(user => {
  return user.id === userRepository.getLongestSleepers(todayDate)}).getFirstName());

$('#sleep-friend-worst-sleeper').text( userRepository.users.find(user => {
  return user.id === userRepository.getWorstSleepers(todayDate)}).getFirstName());

$('#sleep-info-hours-average-alltime').text(user.hoursSleptAverage);

$('#steps-info-miles-walked-today').text(user.activityRecord.find(activity => {
  return (activity.date === todayDate && activity.userId === user.id)}).calculateMiles(userRepository));

$('#sleep-info-quality-average-alltime').text(user.sleepQualityAverage);

$('#sleep-info-quality-today').text(sleepData.find(sleep => {
  return sleep.userID === user.id && sleep.date === todayDate}).sleepQuality);

$('#sleep-user-hours-today').text(sleepData.find(sleep => {
  return sleep.userID === user.id && sleep.date === todayDate}).hoursSlept);

$('#stairs-calendar-flights-average-weekly').text(user.calculateAverageFlightsThisWeek(todayDate));

$('#stairs-calendar-stairs-average-weekly').text((user.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0));

$('#stairs-friend-flights-average-today').text((userRepository.calculateAverageStairs(todayDate) / 12).toFixed(1));

$('#stairs-info-flights-today').text(activityData.find(activity => {
  return activity.userID === user.id && activity.date === todayDate}).flightsOfStairs);

$('#stairs-user-stairs-today').text(activityData.find(activity => {
  return activity.userID === user.id && activity.date === todayDate}).flightsOfStairs * 12);

//
// stairsTrendingButton.addEventListener('click', function() {
//   user.findTrendingStairsDays();
//   trendingStairsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStairsDays[0]}</p>`;
// });
//
$('#steps-calendar-total-active-minutes-weekly').text(user.calculateAverageMinutesActiveThisWeek(todayDate));

$('#steps-calendar-total-steps-weekly').text(user.calculateAverageStepsThisWeek(todayDate))

$('#steps-friend-active-minutes-average-today').text(userRepository.calculateAverageMinutesActive(todayDate));

$('#steps-friend-average-step-goal').text(`${userRepository.calculateAverageStepGoal()}`);

$('#steps-friend-steps-average-today').text(userRepository.calculateAverageSteps(todayDate));

$('#steps-info-active-minutes-today').text(activityData.find(activity => {
  return activity.userID === user.id && activity.date === todayDate}).minutesActive);

$('#steps-user-steps-today').text(activityData.find(activity => {
  return activity.userID === user.id && activity.date === todayDate}).numSteps);

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
