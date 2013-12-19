/*
 * a Fitbit data integration class
 */
var $ = require('jquery');
var OAuth = require('OAuth');
var User = require('../models/user');
var FitbitActivityData = require('../models/fitbitactivitydata');

var FitbitCommand = function(app)
{
    this.app = app;
    this.date = new Date();
    this.oauth = new OAuth.OAuth(
      'http://api.fitbit.com/oauth/request_token',
      'http://api.fitbit.com/oauth/access_token',
      app.get('fitbit').key,
      app.get('fitbit').secret,
      '1.0',
      null,
      'HMAC-SHA1'
    );
}

FitbitCommand.prototype.addProgram = function(program)
{
    var that = this;
    
    program
      .command('fitbit')
      .option('-d, --date [MM/DD/YYYY]', 'the end date in format MM/DD/YYYY')
      .description('gets fitbit data')
      .action($.proxy(this.exec, this));
}

FitbitCommand.prototype.exec = function(options)
{
    var textdate = options.date;
    this.enddate = (typeof options.date!=='undefined')?(new Date(options.date)):(new Date())
    var that = this;
    //run through each user
    User.find({}, function(error, results) {
        if(error || results == null) {
            console.log(error || 'No users found');
            process.exit(code=0);
        }
        that.runThroughUsers(results, 0, function() {
            console.log('Finished');
            process.exit(code=0);
        });
    });
}

FitbitCommand.prototype.runThroughUsers = function(users, index, done)
{
    if(index >= users.length) {
        done();
        return;
    }
    var date = new Date(this.enddate);
    var that = this;
    this.getDataForUser(users[index], date, 0, function() {
        that.runThroughUsers(users, index+1, done);
    });
}

FitbitCommand.prototype.getDataForUser = function(user, date, index, done)
{
    if(index >= 30) {
        done();
        return;
    }
    var date = new Date(date);
    date.setDate(date.getDate()-1);
    var that = this;
    this.getDataForUserAndDate(user, date, function() {
        that.getDataForUser(user, date, index+1, done);
    });    
}

FitbitCommand.prototype.getDataForUserAndDate = function(user, date, done) 
{
    console.log('Getting Data for user: ' + user.id + ' and date: ' + this.getFormattedDate(date));

    var that = this;
    var url = 'http://api.fitbit.com/1/user/-/activities/date/'+this.getFormattedDate(date)+'.json';
    this.oauth.get(url, user.token, user.secret, function(error, data, req) {
        if(error) {
            console.log(error);
            done();
            return;
        }    
        try {
            var d = JSON.parse(data);
            var summary = d.summary;
        } catch(e) {
            console.log(e);
            done();
            return;
        }
        var params = {
            userid:user.id,
            date:new Date(date),
            fairlyActiveMinutes: summary.fairlyActiveMinutes,
            lightlyActiveMinutes: summary.lightlyActiveMinutes,
            marginalCalories: summary.marginalCalories,
            sedentaryMinutes: summary.sedentaryMinutes,
            steps: summary.steps,
            veryActiveMinutes: summary.veryActiveMinutes,
        };
        
        FitbitActivityData.update({userid:user.id, date:date}, params , {upsert:true}, function(error, rowsAffected) {
            if(error) {
                console.log(error);
            }
            done();
        });
    });
}



FitbitCommand.prototype.getFormattedDate = function(date)
{
    var day = (String(date.getDate()).length == 1)?"0"+date.getDate():""+date.getDate();
    var month = (String(date.getMonth()+1).length == 1)?"0"+(date.getMonth()+1):""+(date.getMonth()+1);
    return date.getFullYear() + "-" + month + "-" + day;

}

module.exports = FitbitCommand;