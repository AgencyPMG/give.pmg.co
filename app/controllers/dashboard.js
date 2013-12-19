var FitbitActivityData = require('../models/fitbitactivitydata');
var CompanyScores = require('../models/companyscores');
var UserScores = require('../models/userscores');
var UserStrategy = require('../algos/userstrategy');

module.exports = {
    
    home: function(req, res) {
        if(req.user.charity == '' || req.user.clientName == '') {
            res.redirect('/user/edit');
        }
        res.render('dashboard', {user:req.user});
    }
    
    , data: function(req, res) {
        var data = {};
        
        function sendData() {
            if(typeof data.userdata !== 'undefined' &&
               typeof data.individualscores !== 'undefined' &&
               typeof data.teamscores !== 'undefined') {
                   res.send(data);
               }
        }
        
        FitbitActivityData.find({userid:"52b1ddcc7f7369e801b39e9b"/* req.user._id */}).sort({date:-1, }).limit(90).exec(function(error, results) {
            if(error) {
                data.error = error;
            }
            data.userdata = results;
            var s = new UserStrategy(data.userdata);
            data.userscore = s.calculateScore();
            sendData();
        });
        
        UserScores.find({}).populate('user').sort({score:'desc'}).limit(10).exec(function(error, results) {
            if(error) {
                data.error = error;
            }
            data.individualscores = results;
            sendData();
        });
        
        CompanyScores.find({}).sort({score:'desc'}).limit(10).exec(function(error, results) {
           if(error) {
               data.error = error;
           }
           data.teamscores = results;
           sendData();
        });
        
        
        
    }
}