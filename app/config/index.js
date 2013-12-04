var _ = require('underscore');
var mongoose = require('mongoose');
var format = require('util').format;

module.exports = function(app)
{
    var config = require('./config');
    
    try {
        var local = require('./local');
        config = _.extend(config, local);
    } catch(e) {
        console.log("No local file found, you should have a local file for security reasons, do not edit the config.js file:\n" + e);
    }

    for(var key in config) {
            app.set(key, config[key]);
    }
    
    var db = app.get('database');
    mongoose.connect(format('mongodb://%s:%s/%s', 
        db.host,
        db.port,
        db.dbname
    ));
    app.set('db', mongoose.connection);    
}