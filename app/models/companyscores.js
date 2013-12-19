/*
 * A modal for data
 */

var mongoose = require('mongoose');

var CompanyScores = new mongoose.Schema({
    companyName: {
        type: String, 
        default: 'other', 
        trim:true
    },
    score: {
        type: Number, 
        required: true
    },
    previousPosition: {
        type: Number,
        default: -1
    }
});

module.exports = mongoose.model('CompanyScores', CompanyScores);