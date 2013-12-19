
var $ = require('jquery');

var UserStrategy = function(userDictionary)
{
    this.dict = $.extend(true, {}, this.defaultDictionary, userDictionary);
}

UserStrategy.prototype.calculateScore = function()
{
    var points = 0;
    points += this.dict.veryActiveMinutes * 2;
    points += this.dict.fairlyActiveMinutes * 1.5;
    points += this.dict.lightlyActiveMinutes * 1.1;
    points += this.dict.steps * .5;
    points += this.dict.marginalCalories * .007
    points -= this.dict.sedentaryMinutes * .0009;
    return points;
}

UserStrategy.prototype.defaultDictionary = {
    marginalCalories: 0,
    fairlyActiveMinutes: 0,
    lightlyActiveMinutes: 0,
    sedentaryMinutes: 0,
    steps: 0,
    veryActiveMinutes: 0
}



module.exports = UserStrategy; 