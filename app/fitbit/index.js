
var _ = require('underscore');
var OAuth = require('OAuth');
var User = require('../models/user');
var util = require('util');
var moment = require('moment');
/*
 * This is a class to handle the fitbit API stuff
 */
var Fitbit = function(options)
{
    this.options = _.extend({}, this.defaultOptions, options);

    this.oauth = new OAuth.OAuth(
      'http://api.fitbit.com/oauth/request_token',
      'http://api.fitbit.com/oauth/access_token',
      this.options.key,
      this.options.secret,
      '1.0',
      null,
      'HMAC-SHA1'
    );
}

/*
 * Sets the fibtit user credentials from a token and secret
 */
Fitbit.prototype.setUserCredentials = function(token, secret)
{
    this.token = token;
    this.secret = secret;
}

/* 
 * Sets the fitbit user credentials from a fitbitID in the database
 */
Fitbit.prototype.getUserCredentialsFromFitbitId = function(fitbitid, done)
{
    var fitbit = this;
    User.findOne({fitbitId:fitbitid}, function(error, user) {
        if(error || user == null) {
            done(error || 'bad user');
            return;
        }
        fitbit.token = user.token;
        fitbit.secret = user.secret;
        done();        
    });
}

Fitbit.prototype.getActivityDataForDate = function(date, done)
{
    var url = this.options.baseURL + util.format('%s/%s/user/-/activities/date/%s.%s', 
        this.options.baseURL, 
        this.options.version,
        moment(date).format('YYYY-MM-DD'),
        this.options.format
    );
    
    this.oauth.get(url, this.token, this.secret, function(error, data, req) {
        if(error) {
            done(error, null);
            return;
        }    
        try {
            var d = JSON.parse(data);
            var summary = d.summary;
        } catch(e) {
            done(e, null);
            return;
        }
        done(null, {
            userid:user.id,
            date:new Date(date),
            fairlyActiveMinutes: summary.fairlyActiveMinutes,
            lightlyActiveMinutes: summary.lightlyActiveMinutes,
            marginalCalories: summary.marginalCalories,
            sedentaryMinutes: summary.sedentaryMinutes,
            steps: summary.steps,
            veryActiveMinutes: summary.veryActiveMinutes,
        });        
    });
}


Fitbit.prototype.defaultOptions = {
    key:'',
    secret:'',
    baseURL:'http://api.fitbit.com',
    version:'1',
    format:'json'
}




module.exports = Fitbit;