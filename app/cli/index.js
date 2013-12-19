#!/usr/bin/env node

/**
 * Module dependencies.
 */
 
var express = require('express');
var app = express();
require('../config')(app);
module.exports = app;

var program = require('commander');


var includes = ['fitbit', 'scoreboard'];

for(var index in includes) {
    var CommandClass = require('./' + includes[index]);
    var obj = new CommandClass(app);
    obj.addProgram(program);
}

program.parse(process.argv);

if (process.argv.length <= 2) {
    console.log(program.helpInformation());
    process.exit(code=0);
}