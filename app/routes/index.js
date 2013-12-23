/*
 * routes file
 * @author Chris Alvares <chris.alvares@pmg.co>
 * @since 0.1
 */
var mainRoute = require('../controllers');
var login = require('../controllers/login');
var passport = require('passport');
var FitbitStrategy = require('passport-fitbit').Strategy;
var dashboard = require('../controllers/dashboard');
module.exports = function(app)
{
    passport.use(new FitbitStrategy({
        consumerKey: app.get('fitbit').key,
        consumerSecret: app.get('fitbit').secret,
        callbackURL: "http://"+app.get('domain')+":3000/auth/fitbit/callback"
      },
      login.setUser));

    app.get('/', mainRoute.index);
    app.get('/login', passport.authenticate('fitbit'), login.login);
    app.get('/auth/fitbit/callback', passport.authenticate('fitbit', {failureRedirect: '/login'}), login.login);
    app.get('/user/edit', ensureAuthenticated, login.editUserDialog);
    app.post('/user/edit/save', ensureAuthenticated, login.updateUser);

    app.get('/dashboard', ensureAuthenticated, dashboard.home);
    app.get('/dashboard/data', ensureAuthenticated, dashboard.data);
    app.post('/auth/fitbit/subscription', require('../controllers/fitbit')(app).fetch); 
    
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}