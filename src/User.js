import domUpdates from './DomUpdates'


 class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.address = userData.address;
    this.email = userData.email;
    this.strideLength = userData.strideLength;
    this.dailyStepGoal = userData.dailyStepGoal;
    this.totalStepsThisWeek = 0;
    this.friends = userData.friends;
    this.ouncesAverage = 0;
    this.ouncesRecord = [];
    this.hoursSleptAverage = 0;
    this.sleepQualityAverage = 0;
    this.sleepHoursRecord = [];
    this.sleepQualityRecord = [];
    this.activityRecord = [];
    this.accomplishedDays = [];
    this.trendingStepDays = [];
    this.trendingStairsDays = [];
    this.friendsNames = [];
    this.friendsActivityRecords = []
  }

  getFirstName() {
    var names = this.name.split(' ');
    return names[0].toUpperCase();
  }

  calculateUserSleepData(user, todayDate, sleepData) {
    this.calculateAverageHoursThisWeek(todayDate);
    this.calculateAverageQualityThisWeek(todayDate);
    this.calculateAverageQualityToday(user, todayDate, sleepData);
    this.calculateAverageHoursSleptToday(user, todayDate, sleepData);
  }

  calculateUserActivityData(user, todayDate, userRepository, activityData) {
    this.calculateAverageMinutesActiveThisWeek(todayDate);
    this.calculateAverageStepsThisWeek(todayDate);
    this.calculateAverageFlightsThisWeek(todayDate);
    this.calculateMilesWalkedToday(user, todayDate, userRepository);
    this.calculateAverageMinutesActiveToday(user, todayDate, activityData);
    this.calculateAverageStepsToday(user, todayDate, activityData);
    this.calculateAverageFlightsToday(user, todayDate, activityData);
    this.calculateAverageStairsToday(user, todayDate, activityData);
  }

  calculateUserHydrationData(user, todayDate, hydrationData) {
    this.calculateTotalOuncesToday(user, todayDate, hydrationData);
  }

  updateHydration(date, amount) {
    this.ouncesRecord.unshift({[date]: amount});
    if (this.ouncesRecord.length) {
      this.ouncesAverage = Math.round((amount + (this.ouncesAverage * (this.ouncesRecord.length - 1))) / this.ouncesRecord.length);
    } else {
      this.ouncesAverage = amount;
    }
  }

  addDailyOunces(date) {
    return this.ouncesRecord.reduce((sum, record) => {
      let amount = record[date];
      if (amount) {
        sum += amount
      }
      return sum
    }, 0)
  }

  updateSleep(date, hours, quality) {
    this.sleepHoursRecord.unshift({
      'date': date,
      'hours': hours
    });
    this.sleepQualityRecord.unshift({
      'date': date,
      'quality': quality
    });
    if(this.sleepHoursRecord.length) {
      this.hoursSleptAverage = ((hours + (this.hoursSleptAverage * (this.sleepHoursRecord.length - 1))) / this.sleepHoursRecord.length).toFixed(1);
    } else {
      this.hoursSleptAverage = hours;
    }
    if (this.sleepQualityRecord.length) {
      this.sleepQualityAverage = ((quality + (this.sleepQualityAverage * (this.sleepQualityRecord.length - 1))) / this.sleepQualityRecord.length).toFixed(1);
    } else {
      this.sleepQualityAverage = quality;
    }
  }
  //Check
  calculateAverageHoursThisWeek(todayDate) {
    let averageHours = (this.sleepHoursRecord.reduce((sum, sleepAct) => {
      let index = this.sleepHoursRecord.indexOf(this.sleepHoursRecord.find(sleep => sleep.date === todayDate));
      if (index <= this.sleepHoursRecord.indexOf(sleepAct) && this.sleepHoursRecord.indexOf(sleepAct) <= (index + 6)) {
        sum += sleepAct.hours;
      }
      return sum;
    }, 0) / 7).toFixed(1);
    domUpdates.displayAverageHourlySleepThisWeek(averageHours);
  }
  //Check
  calculateMilesWalkedToday(user, todayDate, userRepository) {
    let milesWalked = this.activityRecord.find(activity => {
      return (activity.date === todayDate && activity.userId === user.id)
    }).calculateMiles(userRepository);
    domUpdates.displayMilesWalkedToday(milesWalked);
  }
  //Check
  calculateAverageMinutesActiveToday(user, todayDate, activityData) {
    let minutesActiveToday = activityData.find(activity => {
      return activity.userID === user.id && activity.date === todayDate
    }).minutesActive
    domUpdates.displayAverageMinutesActiveToday(minutesActiveToday);
  }
  //Check
  calculateAverageStepsToday(user, todayDate, activityData) {
    let averageStepsToday = activityData.find(activity => {
      return activity.userID === user.id && activity.date === todayDate
    }).numSteps
    domUpdates.displayTotalStepsToday(averageStepsToday);
  }
  //Check
  calculateAverageFlightsToday(user, todayDate, activityData) {
    let averageFlightsToday = activityData.find(activity => {
      return activity.userID === user.id && activity.date === todayDate
    }).flightsOfStairs
    domUpdates.displayTotalFlightsToday(averageFlightsToday);
  }
  //Check
  calculateAverageStairsToday(user, todayDate, activityData) {
    let averageStairsToday = activityData.find(activity => {
      return activity.userID === user.id && activity.date === todayDate
    }).flightsOfStairs * 12;
    domUpdates.displayTotalStairsToday(averageStairsToday);
  }
  //Check
  calculateTotalOuncesToday(user, todayDate, hydrationData) {
    let averageOuncesToday = hydrationData.find(hydration => {
      return hydration.userID === user.id && hydration.date === todayDate
    }).numOunces;
    domUpdates.displayTotalOuncesToday(averageOuncesToday);
  }
  //Check
  calculateAverageQualityToday(user, todayDate, sleepData) {
    let averageQualityToday = sleepData.find(sleep => {
      return sleep.userID === user.id && sleep.date === todayDate
    }).sleepQuality;
    domUpdates.displaySleepQualityToday(averageQualityToday);
  }
  //Check
  calculateAverageHoursSleptToday(user, todayDate, sleepData) {
    let hoursSlept = sleepData.find(sleep => {
      return sleep.userID === user.id && sleep.date === todayDate
    }).hoursSlept;
    domUpdates.displayHoursSleepToday(hoursSlept);
  }
  //Check
  calculateAverageQualityThisWeek(todayDate) {
    let averageQuality = (this.sleepQualityRecord.reduce((sum, sleepAct) => {
      let index = this.sleepQualityRecord.indexOf(this.sleepQualityRecord.find(sleep => sleep.date === todayDate));
      if (index <= this.sleepQualityRecord.indexOf(sleepAct) && this.sleepQualityRecord.indexOf(sleepAct) <= (index + 6)) {
        sum += sleepAct.quality;
      }
      return sum;
    }, 0) / 7).toFixed(1);
    domUpdates.displayAverageSleepQualityThisWeek(averageQuality);
  }

  updateActivities(activity) {
    this.activityRecord.unshift(activity);
    if (activity.numSteps >= this.dailyStepGoal) {
      this.accomplishedDays.unshift(activity.date);
    }
  }

  findClimbingRecord() {
    return this.activityRecord.sort((a, b) => {
      return b.flightsOfStairs - a.flightsOfStairs;
    })[0].flightsOfStairs;
  }

  calculateDailyCalories(date) {
    let totalMinutes = this.activityRecord.filter(activity => {
      return activity.date === date
    }).reduce((sumMinutes, activity) => {
      return sumMinutes += activity.minutesActive
    }, 0);
    return Math.round(totalMinutes * 7.6);
  }
  //Check
  calculateAverageMinutesActiveThisWeek(todayDate) {
    let minutesActive = (this.activityRecord.reduce((sum, activity) => {
      let index = this.activityRecord.indexOf(this.activityRecord.find(activity => activity.date === todayDate));
      if (index <= this.activityRecord.indexOf(activity) && this.activityRecord.indexOf(activity) <= (index + 6)) {
        sum += activity.minutesActive;
      }
      return sum;
    }, 0) / 7).toFixed(0);
    console.log('hi', minutesActive)
    domUpdates.displayAverageMinutesActiveThisWeek(minutesActive);
  }
  //Check
  calculateAverageStepsThisWeek(todayDate) {
    let averageSteps = (this.activityRecord.reduce((sum, activity) => {
      let index = this.activityRecord.indexOf(this.activityRecord.find(activity => activity.date === todayDate));
      if (index <= this.activityRecord.indexOf(activity) && this.activityRecord.indexOf(activity) <= (index + 6)) {
        sum += activity.steps;
      }
      return sum;
    }, 0) / 7).toFixed(0);
    domUpdates.displayTotalStepsThisWeek(averageSteps);
  }
  //Check
  calculateAverageFlightsThisWeek(todayDate) {
    let averageFlightsThisWeek = (this.activityRecord.reduce((sum, activity) => {
      let index = this.activityRecord.indexOf(this.activityRecord.find(activity => activity.date === todayDate));
      if (index <= this.activityRecord.indexOf(activity) && this.activityRecord.indexOf(activity) <= (index + 6)) {
        sum += activity.flightsOfStairs;
      }
      return sum;
    }, 0) / 7).toFixed(1);
    domUpdates.displayAverageFlightsThisWeek(averageFlightsThisWeek);
    domUpdates.displayAverageStairsThisWeek((averageFlightsThisWeek * 12).toFixed(0));
  }

  findTrendingStepDays() {
    let positiveDays = [];
    for (var i = 0; i < this.activityRecord.length; i++) {
      if (this.activityRecord[i + 1] && this.activityRecord[i].steps > this.activityRecord[i + 1].steps) {
        positiveDays.unshift(this.activityRecord[i].date);
      } else if (positiveDays.length > 2) {
        this.trendingStepDays.push(`Your most recent positive step streak was ${positiveDays[0]} - ${positiveDays[positiveDays.length - 1]}!`);
        positiveDays = [];
      }
    }
  }

  findTrendingStairsDays() {
    let positiveDays = [];
    for (var i = 0; i < this.activityRecord.length; i++) {
      if (this.activityRecord[i + 1] && this.activityRecord[i].flightsOfStairs > this.activityRecord[i + 1].flightsOfStairs) {
        positiveDays.unshift(this.activityRecord[i].date);
      } else if (positiveDays.length > 2) {
        this.trendingStairsDays.push(`Your most recent positive climbing streak was ${positiveDays[0]} - ${positiveDays[positiveDays.length - 1]}!`);
        positiveDays = [];
      }
    }
  }

  findFriendsNames(users) {
    this.friends.forEach(friend => {
      this.friendsNames.push(users.find(user => user.id === friend).getFirstName());
    })
  }

  calculateTotalStepsThisWeek(todayDate) {
    this.totalStepsThisWeek = (this.activityRecord.reduce((sum, activity) => {
      let index = this.activityRecord.indexOf(this.activityRecord.find(activity => activity.date === todayDate));
      if (index <= this.activityRecord.indexOf(activity) && this.activityRecord.indexOf(activity) <= (index + 6)) {
        sum += activity.steps;
      }
      return sum;
    }, 0));
  }

  findFriendsTotalStepsForWeek(users, date) {
    this.friends.map(friend => {
      let matchedFriend = users.find(user => user.id === friend);
      matchedFriend.calculateTotalStepsThisWeek(date);
      this.friendsActivityRecords.push(
        {
          'id': matchedFriend.id,
          'firstName': matchedFriend.name.toUpperCase().split(' ')[0],
          'totalWeeklySteps': matchedFriend.totalStepsThisWeek
        })
    })
    this.calculateTotalStepsThisWeek(date);
    this.friendsActivityRecords.push({
      'id': this.id,
      'firstName': 'YOU',
      'totalWeeklySteps': this.totalStepsThisWeek
    });
    this.friendsActivityRecords = this.friendsActivityRecords.sort((a, b) => b.totalWeeklySteps - a.totalWeeklySteps);
  }

  sortedHydrationDataByDate(date) {
    console.log(this.ouncesRecord)

    }
  };


export default User;
