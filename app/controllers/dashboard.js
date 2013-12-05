module.exports = {
    
    home: function(req, res) {
        if(req.user.charity == '' || req.user.clientName == '') {
            res.redirect('/user/edit');
        }
        res.send("");
    }
    
    
    
}