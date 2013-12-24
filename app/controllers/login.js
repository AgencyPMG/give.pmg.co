var passport = require('passport');
var User = require('../models/user');
var $ = require('jquery');
module.exports = {
    
    login:function(req, res) {
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
    
    , updateUser:function(req, res) {
        var params = {
            firstName:req.param('first-name'),
            lastName:req.param('last-name'),
            charity:req.param('charity'),
            clientName:req.param('client-name')
        };
        
        User.update({id:req.user.id}, params, {upsert:false}, function(error) {
            if(error) {
                console.log(error);
                res.redirect('/user/edit?error=' + encodeURIComponent(error));
                return;
            }
            req.user = $.extend(req.user, params);
            try { req.session.passport.user = req.user} catch(e){console.log(e)};
            res.redirect('/dashboard/');
        });
    }
    
    , editUserDialog:function(req, res) {
        res.render('user_edit', {user:req.user});
    }
}