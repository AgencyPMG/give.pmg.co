/*
 * A modal for caching data
 * Daemon processes will update the data, and the app will get the data
 */

var mongoose = require('mongoose');

var FitbitActivityData = new mongoose.Schema({
    userid: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    fairlyActiveMinutes: {
        type: Number, 
        default: 0
    },
    lightlyActiveMinutes: {
        type: Number, 
        default: 0
    },
    marginalCalories: {
        type: Number, 
        default: 0
    },
    sedentaryMinutes: {
        type: Number, 
        default: 0
    },
    steps: {
        type: Number, 
        default: 0
    },
    veryActiveMinutes: {
        type: Number, 
        default: 0
    }
});

module.exports = mongoose.model('FitbitActivityData', FitbitActivityData);

