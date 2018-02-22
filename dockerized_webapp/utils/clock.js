"use strict";
var moment = require('moment');

// module
var clock = {}

// Values for clock to monitor number of searches
var midnight = "23:59:59";
var deductible;

// Clock object
function My_Clock() {
    this.currTime = moment().format("HH:mm:ss");
}

// updates clock every second
My_Clock.prototype.run = function() {
    setInterval(this.update.bind(this), 1000);
}


// Clock update function
My_Clock.prototype.update = function() {

    this.currTime = moment().format("HH:mm:ss");
    console.log(moment().format("HH:mm:ss"));
    // var testMidnight = moment().endOf('day').format("HH:mm:ss");

    // Reset deductible at midnight
    if (midnight === this.currTime) {
        this.resetDeductible();
    }
}


// Resetting deductible to 50,000 searches
My_Clock.prototype.resetDeductible = function() {
    console.log("Reset deductible");
    deductible = 50000;
}


// Set deductible and run clock
clock.setUpClock = function() {
    deductible = 50000;
    console.log("Setting up clock");
    var clock = new My_Clock();
    clock.run();
}


module.exports = clock;
