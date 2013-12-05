/*
 * A modal for caching data
 * Daemon processes will update the data, and the app will get teh data
 */

var mongoose = require('mongoose');

var User = new mongoose.Schema({
    fitbitId: {
        type: String
    }
    , firstName: {
        type: String, 
        default: '', 
        trim:true}
    , lastName: {
        type: String,
        default: '',
        trim:true}
    , token: {
        type: String,
        default:'',
        trim:true}
    , secret: {
        type: String,
        default:'',
        trim:true}
    , clientName: {
        type: String,
        default:'',
        trim:true}
    , charity: {
        type: String,
        default:'',
        trim:true}
    , createdAt: {
        type:Date, 
        default: Date.now}    
});

User.methods = {

}

module.exports = mongoose.model('User', User);