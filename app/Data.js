
//Global Data for blocks
const block_data =
{
	"8":{
		"Command":{
			"Command":{
				"block_name": "Command",
				"block_shape": "Command_1",
				"block_points": "12",
				"block_selection_weight": "0",
				"block_mirror": "800"
			}
		},
		"Hull":{
			"802":{
				"block_name": "Hull",
				"block_shape": "Triangle_1",
				"block_points": "0",
				"block_selection_weight": "100",
				"block_mirror": "802"
			},
			"826":{
				"block_name": "Hull",
				"block_shape": "Square_1",
				"block_points": "0",
				"block_selection_weight": "100",
				"block_mirror": "826"
			}
		},
		"Thrust":{
			"803":{
				"block_name": "Thruster_mini",
				"block_shape": "Thruster_1",
				"block_points": "3",
				"block_selection_weight": "100",
				"block_mirror": "803"
			},
			"804":{
				"block_name": "Thuster_Small",
				"block_shape": "Thruster_2",
				"block_points": "4",
				"block_selection_weight": "100",
				"block_mirror": "804"
			}

		},
		"Module":{
			"801":{
				"block_name": "Generator",
				"block_shape": "Square_1",
				"block_points": "20",
				"block_selection_weight": "100",
				"block_mirror": "801"
			},
			"831":{
				"block_name": "Plasma_Cannon",
				"block_shape": "Ocatagon_1",
				"block_points": "17",
				"block_selection_weight": "100",
				"block_mirror": "831"
			}
		}
	}
};

const shape_data =
{
	"Command_1":{
		"x_bounds": [-5,2.5,5,5,2.5,-5],
		"y_bounds": [5,5,2.5,-2.5,-5,-5],
		"x_attachments": [0,3.75,5,3.75,0,-5],
		"y_attachments": [5,3.75,0,-3.75,-5,0],
		"angle": [90,45,0,315,270,180],
		"thruster": [0,0,0,0,0,0]
	},
	"Square_1":{
		"x_bounds": [-5,5,5,-5],
		"y_bounds": [5,5,-5,-5],
		"x_attachments": [0,5,0,-5],
		"y_attachments": [5,0,-5,0],
		"angle": [90,0,270,180],
		"thruster": [0,0,0,0]
	},
	"Triangle_1":{
		"x_bounds": [-3.333,6.667,-3.333],
		"y_bounds": [6.667,-3.333,-3.333],
		"x_attachments": [-3.333,1.667,1.667],
		"y_attachments": [1.667,1.667,-3.333],
		"angle": [180,45,270],
		"thruster": [0,0,0]
	},
	"Thruster_1":{
		"x_bounds": [-0.9575,0.9575,0.9575,-0.9575],
		"y_bounds": [3.5,3,-3,-3.5],
		"x_attachments": [0.9575,-0.9575],
		"y_attachments": [0,0],
		"angle": [0,180],
		"thruster": [0,1]
	},
	"Ocatagon_1":{
		"x_bounds": [-5,-2.5,2.5,5,5,2.5,-2.5,-5],
		"y_bounds": [2.5,5,5,2.5,-2.5,-5,-5,-2.5],
		"x_attachments": [0,3.75,5,3.75,0,-3.75,-5,-3.75],
		"y_attachments": [5,3.75,0,-3.75,-5,-3.75,0,3.75],
		"angle": [90,45,0,315,270,225,180,135],
		"thruster": [0,0,0,0,0,0,0,0]
	},
	"Thruster_2":{
		"x_bounds": [-1.6065,1.6065,1.6065,-1.6065],
		"y_bounds": [4.9,2.5,-2.5,-4.9],
		"x_attachments": [1.6065,-1.6065],
		"y_attachments": [0,0],
		"angle": [0,180],
		"thruster": [0,1]
	}
};

const block_mirror_number = 	[
								802,
								12028,
								248,
								15135,
								15034,
								12027,
								15134
							];

//Collect the key values
var hull_indexs = {};
var thurst_indexs = {};
var module_indexs = {};

for(var faction in block_data){
	hull_indexs[faction] = [];
	thurst_indexs[faction] = [];
	module_indexs[faction] = [];

	for(var index in block_data[faction].Hull){
		hull_indexs[faction].push(index);
	}
	for(var index in block_data[faction].Thrust){
		thurst_indexs[faction].push(index);
	}
	for(var index in block_data[faction].Module){
		module_indexs[faction].push(index);
	}
}

module.exports = {
  block_data: block_data,
  shape_data: shape_data,
  block_mirror_number: block_mirror_number,
  hull_indexs: hull_indexs,
  thurst_indexs: thurst_indexs,
  module_indexs: module_indexs
};
