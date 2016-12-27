var Data = require('./Data');
var Util = require('./Util');

//Block related functions
function Block(faction,block_number,type){
	this.x = 0.0;
	this.y = 0.0;
	this.angle = 0.0;
	this.type = type;
	this.block_data = Util.copyObject(Data.block_data[faction][type][block_number]);
	this.shape = Util.copyObject(Data.shape_data[this.block_data.block_shape]);

	//Functions
	this.rotate = rotate;
	this.translate = translate;
	this.roundBlock = roundBlock;
	this.removeAttachment = removeAttachment;
}

function rotate(angle){
	var ROUNDING_ERROR = .001;
	//check for zero. No reason to rotate zero
    if(angle != 0.0)
    {
        //Normalize angle
        while(angle < 0.0) angle+= 360.0;
        while(angle >= 360.0) angle -= 360.0;

        //Hold degree angle for "angle" change
        var angle_deg = angle;

        //convert to radian
        angle *= Math.PI /180.0;

        //Change private rotation
        //The .0001 is because floating point angle is showing up as higher than M_PI even though it is not
        if(angle-.0001 > Math.PI)
            this.angle = (angle - 2 * Math.PI);
        else
            this.angle = angle;

        //Rotate bounds
        for(var i = 0; i < this.shape.x_bounds.length; ++i)
        {
            var old_x = this.shape.x_bounds[i];
            var old_y = this.shape.y_bounds[i];

            //Rotation
            this.shape.x_bounds[i] = old_x * Math.cos(angle) - old_y * Math.sin(angle);
            this.shape.y_bounds[i] = old_y * Math.cos(angle) + old_x * Math.sin(angle);

            //Rounding down because of trig floating point errors
            if(ROUNDING_ERROR > this.shape.x_bounds[i] && this.shape.x_bounds[i]  > -ROUNDING_ERROR)
                this.shape.x_bounds[i] = 0.0;
            if(ROUNDING_ERROR > this.shape.y_bounds[i] && this.shape.y_bounds[i] > -ROUNDING_ERROR)
                this.shape.y_bounds[i] = 0.0;
        }

        //Rotate the attachments and "angles"
        for(var i = 0; i < this.shape.x_attachments.length; ++i)
        {
            var old_x = this.shape.x_attachments[i];
            var old_y = this.shape.y_attachments[i];

            //Rotation
            this.shape.x_attachments[i] = old_x * Math.cos(angle) - old_y * Math.sin(angle);
            this.shape.y_attachments[i] = old_y * Math.cos(angle) + old_x * Math.sin(angle);

            //Round because trig suckssssss
            if(ROUNDING_ERROR > this.shape.x_attachments[i] && this.shape.x_attachments[i]  > -ROUNDING_ERROR)
                this.shape.x_attachments[i] = 0.0;
            if(ROUNDING_ERROR > this.shape.y_attachments[i] && this.shape.y_attachments[i] > -ROUNDING_ERROR)
                this.shape.y_attachments[i] = 0.0;

            //Change angle
            this.shape.angle[i] += angle_deg;

            //Normalize
            while(this.shape.angle[i] < 0.0){ this.shape.angle[i] += 360.0; }
            while(this.shape.angle[i] >= 360.0){ this.shape.angle[i] -= 360.0; }
        }
    }
}

function translate(x,y){
	this.x = x;
	this.y = y;

	for(var i = 0; i < this.shape.x_bounds.length; ++i){
		this.shape.x_bounds[i] += x;
		this.shape.y_bounds[i] += y;
	}

	for(var i = 0; i < this.shape.x_attachments.length; ++i){
		this.shape.x_attachments[i] += x;
		this.shape.y_attachments[i] += y;
	}
}

function roundBlock(){
	var rounding_factor = 10000;
	this.x = Math.round(this.x * rounding_factor) / rounding_factor;
	this.y = Math.round(this.y * rounding_factor) / rounding_factor;
	this.angle = Math.round(this.angle * rounding_factor) / rounding_factor;

	for(var i = 0; i < this.shape.x_bounds.length; ++i){
		this.shape.x_bounds[i] = Math.round(this.shape.x_bounds[i] * rounding_factor) / rounding_factor;
		this.shape.y_bounds[i] = Math.round(this.shape.y_bounds[i] * rounding_factor) / rounding_factor;
	}
	for(var i = 0; i < this.shape.x_bounds.length; ++i){
		this.shape.x_attachments[i] = Math.round(this.shape.x_attachments[i] * rounding_factor) / rounding_factor;
		this.shape.y_attachments[i] = Math.round(this.shape.y_attachments[i] * rounding_factor) / rounding_factor;
	}
}

function removeAttachment(index){
	this.shape.x_attachments.splice(index,1);
	this.shape.y_attachments.splice(index,1);
	this.shape.angle.splice(index,1);
	this.shape.thruster.splice(index,1);
}

module.exports = {
  Block: Block
};
