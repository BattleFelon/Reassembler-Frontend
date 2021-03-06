var Util = require('./Util');
var Data = require('./Data');
var BB = require('./BlockBuilder');

//Ship Related Functions
function Ship(name, faction){
	this.name = name;
	this.faction = faction;
	this.blocks = [];
	//Set the command block as the first block
	this.blocks[0] = new BB.Block(faction,"Command","Command");

	//Functions
	this.getShipValue = getShipValue;
	this.addBlock = addBlock;
	this.addBlockSymm = addBlockSymm;
	this.drawShip = drawShip;
	this.addBlockType = addBlockType;
	this.getHullCount = getHullCount;
	this.getThrustPoints = getThrustPoints;
	this.getModulePoints = getModulePoints;

}

function addBlock(faction, block_number, attachment_block_index,type){

	//Check block type for thruster things
	if(type != "Thrust" && this.blocks[attachment_block_index].type == "Thrust"){
		return(false);
	}

	var new_block = new BB.Block(faction,block_number,type);
	var ship_block_indexs = [];

	//Non-repeating Random attachment point index checking
	while(ship_block_indexs.length < this.blocks[attachment_block_index].shape.x_attachments.length){

		var ship_attachment_index = Util.getRandomInt(0, this.blocks[attachment_block_index].shape.x_attachments.length);
		while(Util.doesRepeat(ship_attachment_index,ship_block_indexs)){
			var ship_attachment_index = Util.getRandomInt(0, this.blocks[attachment_block_index].shape.x_attachments.length);
		}
		ship_block_indexs.push(ship_attachment_index);

		var new_block_indexs = [];

		//More Thruster Nonsense
		if(type == "Thrust"){
			fitBlock(0, ship_attachment_index, new_block, this.blocks[attachment_block_index]);
			var res = checkBlocks(new_block,this.blocks);

			if(res == false){
				this.blocks.push(new_block);
				return(true);
			}

			new_block = new BB.Block(faction,block_number,type);
		}
		else{
			while(new_block_indexs.length < new_block.shape.x_attachments.length){

				var new_index = Util.getRandomInt(0, new_block.shape.x_attachments.length);
				while(Util.doesRepeat(new_index,new_block_indexs)){
					var new_index = Util.getRandomInt(0, new_block.shape.x_attachments.length);
				}
				new_block_indexs.push(new_index);

				fitBlock(new_index, ship_attachment_index, new_block, this.blocks[attachment_block_index]);

				var res = checkBlocks(new_block,this.blocks);

				if(res == false){
					new_block.removeAttachment(new_index);
					this.blocks[attachment_block_index].removeAttachment(ship_attachment_index);
					this.blocks.push(new_block);
					return(true);
				}
				new_block = new BB.Block(faction,block_number,type);
			}
		}
	}

	return(false);
}

function addBlockSymm(faction, block_number, attachment_block_index,type){
	//Check block type for thruster things
	if(type != "Thrust" && this.blocks[attachment_block_index].type == "Thrust"){
		return(false);
	}

	var new_block = new BB.Block(faction,block_number,type);
	var ship_block_indexs = [];

	//Non-repeating Random attachment point index checking
	while(ship_block_indexs.length < this.blocks[attachment_block_index].shape.x_attachments.length){

		var ship_attachment_index = Util.getRandomInt(0, this.blocks[attachment_block_index].shape.x_attachments.length);
		while(Util.doesRepeat(ship_attachment_index,ship_block_indexs)){
			var ship_attachment_index = Util.getRandomInt(0, this.blocks[attachment_block_index].shape.x_attachments.length);
		}
		ship_block_indexs.push(ship_attachment_index);

		var new_block_indexs = [];

		//More Thruster Nonsense
		if(type == "Thrust"){
			fitBlock(0, ship_attachment_index, new_block, this.blocks[attachment_block_index]);
			var res = checkBlocksSymm(new_block,this.blocks);

			if(res == false){
				this.blocks.push(new_block);

				//Add mirror block
				var mirror_block = new BB.Block(faction,new_block.block_data.block_mirror,type);
				if(checkMirrorBlock(block_number)){
					mirror_block.rotate(new_block.angle*-180.0/Math.PI - 90);
				}
				else{
				mirror_block.rotate(new_block.angle*-180.0/Math.PI);
				}

				mirror_block.translate(new_block.x, -new_block.y);
				mirror_block.roundBlock();
				if(!checkBlocks(mirror_block,this.blocks)){
					//remove all attachments for mirror block
					for(var i = 0; i < mirror_block.shape.x_attachments.length; ++i){
						mirror_block.removeAttachment(i);
					}
					this.blocks.push(mirror_block);
				}

				return(true);
			}

			new_block = new BB.Block(faction,block_number,type);
		}
		else{
			while(new_block_indexs.length < new_block.shape.x_attachments.length){

				var new_index = Util.getRandomInt(0, new_block.shape.x_attachments.length);
				while(Util.doesRepeat(new_index,new_block_indexs)){
					var new_index = Util.getRandomInt(0, new_block.shape.x_attachments.length);
				}
				new_block_indexs.push(new_index);

				fitBlock(new_index, ship_attachment_index, new_block, this.blocks[attachment_block_index]);

				var res = checkBlocksSymm(new_block,this.blocks);

				if(res == false){
					new_block.removeAttachment(new_index);
					this.blocks[attachment_block_index].removeAttachment(ship_attachment_index);
					this.blocks.push(new_block);

					//Add mirror block
					var mirror_block = new BB.Block(faction,new_block.block_data.block_mirror,type);
					if(checkMirrorBlock(block_number)){
						mirror_block.rotate(new_block.angle*-180.0/Math.PI - 90);
					}
					else{
					mirror_block.rotate(new_block.angle*-180.0/Math.PI);
					}

					mirror_block.translate(new_block.x, -new_block.y);
					mirror_block.roundBlock();
					if(!checkBlocks(mirror_block,this.blocks)){
						//remove all attachments for mirror block
						for(var i = 0; i < mirror_block.shape.x_attachments.length; ++i){
							mirror_block.removeAttachment(i);
						}
						this.blocks.push(mirror_block);
					}

					return(true);
				}
				new_block = new BB.Block(faction,block_number,type);
			}
		}
	}
	return(false);
}

function addBlockType(type,symm){
	//select correct indexs
	var indexs;
	if(type == "Hull"){
		indexs = Data.hull_indexs;
	}
	else if(type == "Thrust"){
		indexs = Data.thurst_indexs;
	}
	else if(type == "Module"){
		indexs = Data.module_indexs;
	}

	//get random hull block that passes selection weight
	var weight_check = Util.getRandomInt(0,1000);
	var random_new_block_index = Util.getRandomInt(0,indexs[this.faction].length);
	var key = indexs[this.faction][random_new_block_index];
	var random_new_block_weight = Data.block_data[this.faction][type][key].block_selection_weight;

	while(weight_check >= random_new_block_weight){
		weight_check = Util.getRandomInt(0,1000);
		random_new_block_index = Util.getRandomInt(0,indexs[this.faction].length);
		key = indexs[this.faction][random_new_block_index];
		random_new_block_weight = Data.block_data[this.faction][type][key].block_selection_weight;
	}

	var attempted_blocks = [];
	while(attempted_blocks.length < this.blocks.length){
		var random_index = Util.getRandomInt(0,this.blocks.length);
		while(Util.doesRepeat(random_index,attempted_blocks)){
			random_index = Util.getRandomInt(0, this.blocks.length);
		}
		if(symm == 0){
			if(this.addBlock(this.faction,key,random_index,type)){
				return(true);
			}
		}
		else{
			if(this.addBlockSymm(this.faction,key,random_index,type)){
				return(true);
			}
		}
	}
}

function getShipValue(){
	var total_value = 0;
	for(var i =0; i < this.blocks.length; ++i){
		total_value += parseInt(this.blocks[i].block_data.block_points);
	}
	return(total_value);
}

function getHullCount(){
	var count = 0;
	for(var i =0; i < this.blocks.length; ++i){
		if(this.blocks[i].type == "Hull"){
			count ++;
		}
	}
	return(count);
}

function getThrustPoints(){
	var points = 0;
	for(var i =0; i < this.blocks.length; ++i){
		if(this.blocks[i].type == "Thrust"){
			points += parseInt(this.blocks[i].block_data.block_points);
		}
	}
	return(points);
}

function getModulePoints(){
	var points = 0;
	for(var i =0; i < this.blocks.length; ++i){
		if(this.blocks[i].type == "Module" || this.blocks[i].type == "Command"){
			points += parseInt(this.blocks[i].block_data.block_points);
		}
	}
	return(points);
}

function drawShip(ctx,x,y,zoom){
	ctx.font = "12px Arial";
	ctx.fillText(this.blocks.length.toString(),this.blocks[this.blocks.length-1].x * zoom + x,this.blocks[this.blocks.length-1].y * zoom + y);

	ctx.beginPath();
	for(var i = 0; i < this.blocks.length; i++){

		for(var j = 0; j < this.blocks[i].shape.x_bounds.length; ++j){

			var length = this.blocks[i].shape.x_bounds.length;
			if(j == 0){

				ctx.moveTo(this.blocks[i].shape.x_bounds[j] * zoom + x,this.blocks[i].shape.y_bounds[j] * zoom + y);
				ctx.lineTo(this.blocks[i].shape.x_bounds[length-1] * zoom + x,this.blocks[i].shape.y_bounds[length-1] * zoom + y);
				ctx.moveTo(this.blocks[i].shape.x_bounds[j] * zoom + x,this.blocks[i].shape.y_bounds[j] * zoom + y);
			}
			else if(j < length){
				ctx.lineTo(this.blocks[i].shape.x_bounds[j] * zoom + x,this.blocks[i].shape.y_bounds[j] * zoom + y);
			}
		}
	}
	ctx.stroke();
}

//Block fitting functions
function fitBlock(index1,index2, b1, b2){

	//Rotate Block
	var a1 = b1.shape.angle[index1];
	var a2 = b2.shape.angle[index2];

    var target_angle = a2 + 180.0;
    //Normalize angle
    while(target_angle < 0.0) target_angle+= 360.0;
    while(target_angle > 360.0) target_angle -= 360.0;

    b1.rotate(target_angle - a1);

	var a1 = b1.shape.angle[index1];
	var a2 = b2.shape.angle[index2];
	var new_angle = a1 - a2;

	//Translate Block
	var xdiff = b2.shape.x_attachments[index2] - b1.shape.x_attachments[index1];
	var ydiff = b2.shape.y_attachments[index2] - b1.shape.y_attachments[index1];

	b1.translate(xdiff,ydiff);
	b1.roundBlock();
}

function pointInPolygon(x, y, cornersX, cornersY) {

    var i, j=cornersX.length-1 ;
    var  oddNodes=false;

    var polyX = cornersX;
    var polyY = cornersY;

    for (i=0; i<cornersX.length; i++) {
        if ((polyY[i]< y && polyY[j]>=y ||  polyY[j]< y && polyY[i]>=y) &&  (polyX[i]<=x || polyX[j]<=x)) {
          oddNodes^=(polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x);
        }
        j=i;
    }

    if(oddNodes == 1)
    	oddNodes = true;
    else
    	oddNodes = false;

	return oddNodes;
}

function checkBlocksSymm(b1,blocks){

	for(var i = 0; i < blocks.length; i++){
		if(b1.y <= 0.0){
			return(true);
		}
		if(collisionCheck(b1,blocks[i]) || collisionCheck(blocks[i],b1)){
			return(true);
		}
	}
	return(false);
}

function checkBlocks(b1,blocks){

	for(var i = 0; i < blocks.length; i++){
		if(collisionCheck(b1,blocks[i]) || collisionCheck(blocks[i],b1)){
			return(true);
		}
	}
	return(false);
}

function collisionCheck(b1,b2){

	if(Util.distance(b1.x,b1.y,b2.x,b2.y) < 25){

		if(pointInPolygon(b1.x,b1.y,b2.shape.x_bounds,b2.shape.y_bounds)){
			return(true);
		}

		for(var j = 0; j < b1.shape.x_bounds.length; ++j){

			var x = (b1.shape.x_bounds[j] - b1.x) * .999 + b1.x;
			var y = (b1.shape.y_bounds[j] - b1.y) * .999 + b1.y;

			var res = pointInPolygon(x,y,b2.shape.x_bounds,b2.shape.y_bounds);
			if(res == true){
				return(true);
			}

			x = (b1.shape.x_bounds[j] - b1.x) * .5 + b1.x;
			y = (b1.shape.y_bounds[j] - b1.y) * .5 + b1.y;

			res = pointInPolygon(x,y,b2.shape.x_bounds,b2.shape.y_bounds);
			if(res == true){
				return(true);
			}
		}
	}
	return(false);
}

function checkMirrorBlock(block_number){
	for(var i = 0; i < Data.block_mirror_number.length; ++i){
		if(block_number == Data.block_mirror_number[i]){
			return(true);
		}
	}
	return(false);
}
//Ship Building Code Wah Wah wahhhhh
function buildShip(name, faction,target_hull_amount, target_thruster_points, target_module_points, block_limit, ship_symmetry){
	//Prevent infinite runtime
	var MAX_ATTEMPTS = 200;

	//Check symm
	if(ship_symmetry == 2){
		ship_symmetry = Util.getRandomInt(0,2);
	}

	//New ship declaration
	var new_ship = new Ship(name, faction);
	var enough_hull = false;
	var enough_thrusters = false;
	var enough_modules = false;
	var loop_counter = 0;

	while(!enough_hull || !enough_thrusters || !enough_modules ){
		if(loop_counter > MAX_ATTEMPTS){
			console.log("MAX_ATTEMPTS reached");
			return(new_ship);
		}

		loop_counter++;
		var next_funct = Util.getRandomInt(0,3);

		switch(next_funct){
			case 0:
				if(!enough_hull){
					if(ship_symmetry == 0){
						if(new_ship.addBlockType("Hull",0)){
							loop_counter = 0;
						}
					}
					else{
						if(new_ship.addBlockType("Hull",1)){
							loop_counter = 0;
						}
					}

					//check for condition
					if(new_ship.getHullCount() >= target_hull_amount){
						enough_hull = true;
						if(ship_symmetry == 0){
							new_ship.blocks.pop();
						}
						else{
							new_ship.blocks.pop();
							new_ship.blocks.pop();
						}
					}
				}
				break;
			case 1:
				if(!enough_thrusters && loop_counter > 100){
					if(ship_symmetry == 0){
						if(new_ship.addBlockType("Thrust",0)){
							loop_counter = 0;
						}
					}
					else{
						if(new_ship.addBlockType("Thrust",1)){
							loop_counter = 0;
						}
					}
					//check for condition
					if(new_ship.getThrustPoints() >= target_thruster_points){
						enough_thrusters = true;
						if(ship_symmetry == 0){
							new_ship.blocks.pop();
						}
						else{
							new_ship.blocks.pop();
							new_ship.blocks.pop();
						}
					}
				}
				break;
			case 2:
				if(!enough_modules){
					if(ship_symmetry == 0){
						if(new_ship.addBlockType("Module",0)){
							loop_counter = 0;
						}
					}
					else{
						if(new_ship.addBlockType("Module",1)){
							loop_counter = 0;
						}
					}
					//check for condition
					if(new_ship.getModulePoints() >= target_module_points){
						enough_modules = true;
						if(ship_symmetry == 0){
							new_ship.blocks.pop();
						}
						else{
							new_ship.blocks.pop();
							new_ship.blocks.pop();
						}
					}
				}
				break;
		}

		if(block_limit <= new_ship.blocks.length){
			new_ship.blocks.pop;
			return(new_ship);
		}
	}

	return(new_ship);
}

module.exports = {
	buildShip: buildShip,
	Ship: Ship
};
