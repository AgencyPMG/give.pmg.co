/*
 * A modal for data
 */

var mongoose = require('mongoose');

var UserScores = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    score: {
        type: Number, 
        required: true
    },
});

module.exports = mongoose.model('UserScores', UserScores);