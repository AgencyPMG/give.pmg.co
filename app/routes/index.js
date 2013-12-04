/*
 * routes file
 * @author Chris Alvares <chris.alvares@pmg.co>
 * @since 0.1
 */
var mainRoute = require('../controllers');

module.exports = function(app)
{
    app.get('/', mainRoute.index);
}