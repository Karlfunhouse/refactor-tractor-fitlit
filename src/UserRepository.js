import domUpdates from './DomUpdates'

class UserRepository {
  constructor(userData, sleepData, activityData, hydrationData) {
    this.users = [];
    this.userData = userData
    this.sleepData = sleepData;
    this.activityData = activityData;
    this.hydrationData = hydrationData;
  }

  getUser(id) {
    return this.users.find(function(user) {
      return user.id === id;
    })
  }

  // HANDLERS
  calculateAverageActivityData(todayDate) {
    this.calculateAverageStepGoal();
    this.calculateAverageSteps(todayDate);
    this.calculateAverageFlights(todayDate);
    this.calculateAverageMinutesActive(todayDate);
  }

  calculateAverageHydrationData(todayDate) {
    this.calculateAverageDailyWater(todayDate);
  }

  // HYDRATION
  calculateAverageDailyWater(date) {
    let todaysDrinkers = this.users.filter(user => {
      return user.addDailyOunces(date) > 0;
    });
    let sumDrankOnDate = todaysDrinkers.reduce((sum, drinker) => {
      return sum += drinker.addDailyOunces(date);
    }, 0)
    let averageDailyWater = Math.floor(sumDrankOnDate / todaysDrinkers.length);
    domUpdates.displayAllAverageOuncesToday(averageDailyWater);
    return averageDailyWater
  }

  // SLEEP
  calculateAverageSleepQuality() {
    let totalSleepQuality = this.users.reduce((sum, user) => {
      sum += user.sleepQualityAverage;
      return sum;
    }, 0);
    return totalSleepQuality / this.users.length;
  }

  findBestSleepers(date) {
    return this.users.filter(user => {
      return user.calculateAverageQualityThisWeek(date) > 3;
    })
  }

  getLongestSleepers(date) {
    return this.sleepData.filter(sleep => {
      return sleep.date === date;
    }).sort((a, b) => {
      return b.hoursSlept - a.hoursSlept;
    })[0].userID;
  }

  getWorstSleepers(date) {
    return this.sleepData.filter(sleep => {
      return sleep.date === date;
    }).sort((a, b) => {
      return a.hoursSlept - b.hoursSlept;
    })[0].userID;
  }

  // ACTIVITY
  calculateAverageMinutesActive(date) {
    let allUsersMinutesActiveCount = this.users.map(user => {
      return user.activityRecord.filter(activity => {
        return activity.date === date;
      });
    })
    let sumOfMinutesActive = allUsersMinutesActiveCount.reduce((minutesActiveSum, activityCollection) => {
      activityCollection.forEach(activity => {
        minutesActiveSum += activity.minutesActive
      })
      return minutesActiveSum;
    }, 0);
    let minutesActive = Math.round(sumOfMinutesActive / allUsersMinutesActiveCount.length);
    domUpdates.displayAllActiveMinutesToday(minutesActive);
    return minutesActive
  }

  // STEPS
  calculateAverageStepGoal() {
    let goals = this.users.map(function(user) {
      return user.dailyStepGoal;
    });
    let total = goals.reduce(function(sum, goal) {
      sum += goal;
      return sum;
    }, 0);
    let averageStepsGoal = total / this.users.length;
    domUpdates.displayAllAverageStepGoal(averageStepsGoal)
    return averageStepsGoal
  }

  calculateAverageSteps(date) {
    let allUsersStepsCount = this.users.map(user => {
      return user.activityRecord.filter(activity => {
        return activity.date === date;
      });
    })
    let sumOfSteps = allUsersStepsCount.reduce((stepsSum, activityCollection) => {
      activityCollection.forEach(activity => {
        stepsSum += activity.steps
      })
      return stepsSum;
    }, 0);
    let averageSteps = Math.round(sumOfSteps / allUsersStepsCount.length);
    domUpdates.displayAllAverageStepsToday(averageSteps);
    return averageSteps
  }

  // STAIRS
  calculateAverageFlights(date) {
    let allUsersStairsCount = this.users.map(user => {
      return user.activityRecord.filter(activity => {
        return activity.date === date;
      });
    })
    let sumOfStairs = allUsersStairsCount.reduce((stairsSum, activityCollection) => {
      activityCollection.forEach(activity => {
        stairsSum += activity.flightsOfStairs
      })
      return stairsSum;
    }, 0);
    let averageFlights = Math.round(sumOfStairs / allUsersStairsCount.length);
    domUpdates.displayAllAverageFlightsToday(averageFlights);
    return (averageFlights)
  }
}

export default UserRepository;
