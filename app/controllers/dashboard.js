var FitbitActivityData = require('../models/fitbitactivitydata');


module.exports = {
    
    home: function(req, res) {
        if(req.user.charity == '' || req.user.clientName == '') {
            res.redirect('/user/edit');
        }
        res.render('dashboard', {user:req.user});
    }
    
    , data: function(req, res) {
        var data = {};
        console.log(req.user._id);
        FitbitActivityData.find({userid:"52b1ddcc7f7369e801b39e9b"/* req.user._id */}).sort({date:-1, }).limit(90).exec(function(error, results) {
            if(error) {
                data.error = error;
            }
            data.userdata = results;
            res.send(data);
        });
    }
}