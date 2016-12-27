var SB = require('./ShipBuilder');
var Util = require('./Util');

//Fleet things
function Fleet(name,faction){
	this.name = name;
	this.faction = faction;
	this.ships = [];

	//Functions
	this.getTotalValue = getTotalValue;
	this.drawFleet = drawFleet;
  this.addShip = addShip;
}

function getTotalValue(){
	var value = 0;
	for(var i = 0; i < this.ships.length; i++){
		for(var j = 0; j < this.ships[i].blocks.length; ++j){
			value += parseInt(this.ships[i].blocks[j].block_data.block_points);
		}
	}
	return(value);
}

function buildFleet(name,faction,total_value, min_ship_value, max_ship_value, min_hull, max_hull, module_to_thrust_ratio, block_limit, symmetry){
	var new_fleet = new Fleet(name,faction);

	var loop_counter = 0;
	var target_hull_amount;
	var ship_value;
	var target_thruster_points;
	var target_module_points;
	var symm;

    while(new_fleet.getTotalValue() < total_value){

		target_hull_amount = Util.getRandomInt(min_hull,max_hull);
		ship_value = Util.getRandomInt(min_ship_value,max_ship_value);
		target_thruster_points = (1.0 - module_to_thrust_ratio) * ship_value;
		target_module_points = 	(module_to_thrust_ratio) * ship_value;

		new_fleet.addShip(name + "_" + loop_counter, faction, target_hull_amount,target_thruster_points,target_module_points,block_limit,symm);
		loop_counter++;
	}
  //Remove ship that put it over
  new_fleet.ships.pop();

  //Add new ship that is the perfect value
  var remainder = total_value - new_fleet.getTotalValue();
  ship_value = remainder;
  target_thruster_points = (1.0 - module_to_thrust_ratio) * ship_value;
  target_module_points = 	(module_to_thrust_ratio) * ship_value;
  if(min_ship_value < remainder){
    new_fleet.addShip(name + "_" + "remainder", faction, target_hull_amount,target_thruster_points,target_module_points,block_limit,symm);
  }

	return(new_fleet);
}

function drawFleet(context,x,y,scale){
  context.clearRect(0, 0, 2000, 2000);
	for(var k = 0; k < this.ships.length; ++k){
		this.ships[k].drawShip(context,x, y + 200 * k * scale, scale);
	}
}

function addShip(name, faction,target_hull_amount, target_thruster_points, target_module_points, block_limit, ship_symmetry){
  this.ships.push(SB.buildShip(name, faction,target_hull_amount, target_thruster_points, target_module_points, block_limit, ship_symmetry));
}
module.exports = {
  Fleet: Fleet,
  drawFleet: drawFleet,
  addShip: addShip,
  getTotalValue: getTotalValue,
  buildFleet: buildFleet
};
