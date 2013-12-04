/*
 * A modal for caching data
 * Daemon processes will update the data, and the app will get teh data
 */

var mongoose = require('mongoose');

var AppCache = new mongoose.Schema({
    name: {
        type: String, 
        default: '', 
        trim:true
    },
    cache: {
        type: String, 
        default: '', 
        trim:true
    },
    lastUpdate: {
        type:Date, 
        default: Date.now
    }    
});

AppCache.methods = {
    getCurrentCache:function(name, callback) {
        this.findOne({name:name}).sort('lastUpdate').exec(callback);
    }
}

module.exports = mongoose.model('AppCache', AppCache);