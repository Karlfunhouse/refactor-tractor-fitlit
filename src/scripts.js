// IMPORTS
import './css/base.scss';
import './css/styles.scss';
import UserRepository from './UserRepository';
import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import $ from 'jquery';
import domUpdates from './DomUpdates'

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
    user.findFriendsNames(userRepository.users);
    domUpdates.displayInitialDomData(user, todayDate, userRepository);
    startApplication(user, userRepository, todayDate, activityData, hydrationData, sleepData);
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


function startApplication(user, userRepository, todayDate, activityData, hydrationData, sleepData) {
  user.calculateUserSleepData(user, todayDate, sleepData);
  user.calculateUserActivityData(user, todayDate, userRepository, activityData);
  user.calculateUserHydrationData(user, todayDate, hydrationData);
  userRepository.calculateAverageActivityData(todayDate);
  userRepository.calculateAverageHydrationData(todayDate);
}

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
