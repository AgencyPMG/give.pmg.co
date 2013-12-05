var passport = require('passport');
var User = require('../models/user');

module.exports = {
    
    login:function(req, res) {
        console.log("got here");
        console.log(req.user);
        res.redirect(302, '/dashboard');      
    }
    
    , setUser:function(token, tokenSecret, profile, done) {
        User.update({fitbitId:profile.id}, 
        {
            fitbitId:profile.id,
            firstName:profile.displayName,
            token:token,
            secret:tokenSecret
        }, {upsert: true}, function(error) {
            User.findOne({ fitbitId:profile.id}, function (err, doc){
                done(err, doc);
            });
        });
    }
    
    , editUserDialog:function(req, res) {
        res.send("/usr/");
    }
}