// IMPORTS
import './css/base.scss';
import './css/styles.scss';
import UserRepository from './UserRepository';
import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import $ from 'jquery';
import domUpdates from './domUpdates'

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
    domUpdates.updateTrendingStairsDays(user);
    domUpdates.updateTrendingStepDays(user);
    domUpdates.displayFriendsTotalSteps(user, todayDate, userRepository);
    domUpdates.displayUserInfo(user, todayDate, userRepository, activityData, hydrationData, sleepData);
    // sortedHydrationDataByDate(user);
    domUpdates.loadUserData()
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


// EVENTS
$('#steps-card-container').on('click', (event) => stepsButtonHandler());
$('#hydration-card-container').on('click', (event) => hydrationButtonHandler());
$('#stairs-card-container').on('click', (event) => stairsButtonHandler());
$('#sleep-card-container').on('click', (event) => sleepButtonHandler());
$('#profile-button').on('click', (event) => domUpdates.showUserDropdown());
$('#add-data-button').on('click', (event) => domUpdates.showActivityDropdown());
$('.stairs-trending-button').on('click', (event) => domUpdates.updateTrendingStairsDays)
$('.steps-trending-button').on('click', (event) => domUpdates.updateTrendingStepDays)
$('.add-sleep-button-js').on('click', (event) => postNewSleepData())
$('.add-activity-button-js').on('click', (event) => postNewActivityData())
$('.add-hydration-button-js').on('click', (event) => postNewHydrationData())

// POST DATA FUNCTIONS
function postNewSleepData() {
  fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "userID": Number($('.user-id-js').text()),
      "date": $('.date-input').val().split('-').join('/'),
      "hoursSlept": Number($('.hours-slept-input-js').val()),
      "sleepQuality": Number($('.sleep-quality-input-js').val())
    })
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

function postNewActivityData() {
  fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "userID": Number($('.user-id-js').text()),
        "date": $('.date-input').val().split('-').join('/'),
        "numSteps": Number($('.number-steps-input-js').val()),
        "minutesActive": Number($('.minutes-active-input-js').val()),
        "flightsOfStairs": Number($('.flight-stairs-input-js').val())
    })
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

function postNewHydrationData() {
  fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "userID": Number($('.user-id-js').text()),
        "date": $('.date-input').val().split('-').join('/'),
        "numOunces": Number($('.number-ounces-input-js').val())
    })
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

// EVENT HANDLERS
function stepsButtonHandler() {
  if ($(event.target).hasClass('steps-info-button')) {
    domUpdates.flipCard($('#steps-main-card'), $('#steps-info-card'));
  }
  if ($(event.target).hasClass('steps-friends-button')) {
    domUpdates.flipCard($('#steps-main-card'), $('#steps-friends-card'));
  }
  if ($(event.target).hasClass('steps-trending-button')) {
    domUpdates.flipCard($('#steps-main-card'), $('#steps-trending-card'));
  }
  if ($(event.target).hasClass('steps-calendar-button')) {
    domUpdates.flipCard($('#steps-main-card'), $('#steps-calendar-card'));
  }
  if ($(event.target).hasClass('steps-go-back-button')) {
    domUpdates.flipCard(event.target.parentNode, $('#steps-main-card'));
  }
};

function stairsButtonHandler() {
  if ($(event.target).hasClass('stairs-info-button')) {
    domUpdates.flipCard($('#stairs-main-card'), $('#stairs-info-card'));
  }
  if ($(event.target).hasClass('stairs-friends-button')) {
    domUpdates.flipCard($('#stairs-main-card'), $('#stairs-friends-card'));
  }
  if ($(event.target).hasClass('stairs-trending-button')) {
    domUpdates.flipCard($('#stairs-main-card'), $('#stairs-trending-card'));
  }
  if ($(event.target).hasClass('stairs-calendar-button')) {
    domUpdates.flipCard($('#stairs-main-card'), $('#stairs-calendar-card'));
  }
  if ($(event.target).hasClass('stairs-go-back-button')) {
    domUpdates.flipCard(event.target.parentNode, $('#stairs-main-card'));
  }
};

function hydrationButtonHandler() {
  if ($(event.target).hasClass('hydration-info-button')) {
    domUpdates.flipCard($('#hydration-main-card'), $('#hydration-info-card'));
  }
  if ($(event.target).hasClass('hydration-friends-button')) {
    domUpdates.flipCard($('#hydration-main-card'), $('#hydration-friends-card'));
  }
  if ($(event.target).hasClass('hydration-calendar-button')) {
    domUpdates.flipCard($('#hydration-main-card'), $('#hydration-calendar-card'));
  }
  if ($(event.target).hasClass('hydration-go-back-button')) {
    domUpdates.flipCard(event.target.parentNode, $('#hydration-main-card'));
  }
};

function sleepButtonHandler() {
  if ($(event.target).hasClass('sleep-info-button')) {
    domUpdates.flipCard($('#sleep-main-card'), $('#sleep-info-card'));
  }
  if ($(event.target).hasClass('sleep-friends-button')) {
    domUpdates.flipCard($('#sleep-main-card'), $('#sleep-friends-card'));
  }
  if ($(event.target).hasClass('sleep-calendar-button')) {
    domUpdates.flipCard($('#sleep-main-card'), $('#sleep-calendar-card'));
  }
  if ($(event.target).hasClass('sleep-go-back-button')) {
    domUpdates.flipCard(event.target.parentNode, $('#sleep-main-card'));
  }
};

//   function sortedHydrationDataByDate(user) { user.ouncesRecord.sort((a, b) => {
//     if (Object.keys(a)[0] > Object.keys(b)[0]) {
//       return -1;
//     }
//     if (Object.keys(a)[0] < Object.keys(b)[0]) {
//       return 1;
//     }
//     return 0;
//   })
// };
//
//   let weeklyHydrationDataArray = sortedHydrationDataByDate(user).splice(0, 7);
//   console.log('weekly', weeklyHydrationDataArray);
//   console.log('sorted', sortedHydrationDataByDate.splice(0, 7));
//   //Refactor this into a forEach
//   for (var i = 0; i < $('.daily-oz').length; i++) {
//     $('.daily-oz')[i].text(user.addDailyOunces(Object.keys(sortedHydrationDataByDate[i])[0]))
//   };
  // splice sortedHydrationDataByDate to get most recent 7 entires
  // loop through the first 7 entries and populate the oz per day
// }




// 1 WEEK LEFT CHECKLIST:
  // [X] Date data (find out wtf is going on here)
      // [X] Down the road: working with data up to 1/22
      // or working with more recent data?
  // [X] POSTing:
      // [X] Already written out by Karl - flesh it out
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
      // [ ] base.scss (holds all imports & variables)
      // [ ] styles.scss (holds all styling using variables)
  // [ ] Testing with SPIES
      // [X] Lesson on SPIES
      // [X] Get initial tests passing
      // [ ] Refactor DOM manipulation into methods on an object
      // [ ] Spy on all DOM manipulation methods to verify that they
      // [ ] occurred and were called with the correct arguments
      // [ ] Use an afterEach hook to clean up spies in between tests
  // [ ] Testing Firefox and Safari
  // [X] Mobile design: should work for all different screen sizes
      // [X] Mobile
      // [X] Tablets
      // [X] Desk monitors
      // [ ] Remove common properties from rules at each breakpoint
  // [ ] Accessibility
      // [ ] Tab through app and use it with a mouse
      // [ ] Must be viewable through color-blind extension
      // [ ] Use Accessibility Audit to get close to a score of 100%

// THINGS TO ADDRESS

// let dailyOz = document.querySelectorAll('.daily-oz');
// let dailyOz = $('.daily-oz');

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
