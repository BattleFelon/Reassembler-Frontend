//Reassembler Code
var FB = require('./FleetBuilder');
var Data = require('./Data');

var fleet_1 = FB.buildFleet("name",8,20000, 300, 5000, 10, 100, .6, 1000, 2);

console.log(fleet_1.getTotalValue());



//Drawing
window.addEventListener('keydown',check,false);

function check(e) {
    var magnitude = 5;
    switch(e.key){
    	case 's':
    		originy -= magnitude;
    		break;
    	case 'w':
    		originy += magnitude;
    		break;
    	case 'a':
    		originx += magnitude;
    		break;
    	case 'd':
    		originx -= magnitude;
    		break;
    }
}

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var scale = .5;
var originx = 250;
var originy = 0;

setInterval(function () {fleet_1.drawFleet(context,originx,originy,scale);},100);

canvas.addEventListener("mousewheel", onWheel, false);
// Firefox
canvas.addEventListener("DOMMouseScroll", onWheel, false);

function onWheel (event){
    // cross-browser wheel delta
    var e = event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))

    if(delta == -1){
    	scale *= .9;
    }
    else{
    	scale /= .9;
    }
}
