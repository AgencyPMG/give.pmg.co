/*
 * a Fitbit data integration class
 */
var $ = require('jquery');
var User = require('../models/user');
var FitbitActivityData = require('../models/fitbitactivitydata');
var CompanyScores = require('../models/companyscores');
var UserScores = require('../models/userscores');
var Strategy = require('../algos/userstrategy');

var ScoreboardCommand = function(app)
{
    this.app = app;
}

ScoreboardCommand.prototype.addProgram = function(program)
{
    var that = this;
    
    program
      .command('scoreboard')
      .description('recalcuates the score of the user')
      .action($.proxy(this.exec, this));
}

ScoreboardCommand.prototype.exec = function(options)
{
    this.aggregateUser($.proxy(function() {
        this.aggregateTeams(function() {
            console.log('Finished');
            process.exit(code=0);
        });
    }, this));
}

ScoreboardCommand.prototype.aggregateUser= function(done)
{
    var scoreCommand = this;
    FitbitActivityData.aggregate(
        {$group: {
            _id: '$userid',
            marginalCalories: {$sum:'$marginalCalories'},
            fairlyActiveMinutes: {$sum:'$fairlyActiveMinutes'},
            lightlyActiveMinutes: {$sum:'$lightlyActiveMinutes'},
            sedentaryMinutes: {$sum:'$sedentaryMinutes'},
            steps: {$sum:'$steps'},
            veryActiveMinutes: {$sum:'$veryActiveMinutes'}
        }},
        function(error, usersData) {
            if(error) {
                console.log(error);
            }
            var i = 0;
            for(var index in usersData){
                var s = new Strategy(usersData[index]);
                var points = s.calculateScore(usersData);
                
                UserScores.update({user:usersData[index]._id}, {
                    user:usersData[index]._id,
                    score: points
                }, {upsert:true}, function(error) {
                    if(error) {
                        console.log(error);
                    }
                    i++;
                    if(i == usersData.length) 
                        done();
                });
            }
        }
    )
}

ScoreboardCommand.prototype.aggregateTeams = function(done)
{
    UserScores.find({}).populate('user').exec($.proxy(function(error, users) {
         if(error) {
             console.log(error);
             done();
             return;
         }
         
         var teamScores = this.processTeamScores(users);
         this.updateTeamScores(teamScores, done);         
    }, this));
}

ScoreboardCommand.prototype.processTeamScores = function(users)
{
     var teams = {};
     for(var index in users) {
         var user = users[index].user;
         console.log(user);
         var score = users[index].score;
         if(user.clientName == '') continue;
         if(typeof teams[user.clientName] === 'undefined') {
             teams[user.clientName] = [];
         }
         teams[user.clientName].push(score);
     }
     return teams;
}

ScoreboardCommand.prototype.updateTeamScores = function(scores, done)
{
    var i = 0;
    var len = Object.keys(scores).length;
    console.log(scores);
    for(var name in scores) {
        var totalScore = 0;
        for(var r=0;r<scores[name].length;r++) {
            totalScore += scores[name][i];
        }
        totalScore = totalScore / scores[name].length;
        
        CompanyScores.update({companyName:name}, {
            companyName: name,
            score: totalScore
        }, {upsert:true}, function(error) {
            if(error) 
                console.log(error);
            i++;
            if(i == len) {
                done();
            }
        });
    }
}

module.exports = ScoreboardCommand;