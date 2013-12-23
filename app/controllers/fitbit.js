require('../fitbit');

module.exports = function(app)
{
    return {
        fetch:function(req, res)
        {
            res.send(204);
            
            console.log(req.body);
            
        }
    }
}