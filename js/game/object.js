//Object class for creating trees
function CreateObject (options) {
	var that = {};
	that.role = "object";

	that.id = nextId++;
	that.context = options.context;
	that.width = options.width || 64;
	that.height = options.height || 64;

	that.buffer = {};
	that.buffer.up = 20;
	that.buffer.left = 20;
	that.buffer.right = 20;
	that.buffer.down = 0;

	that.image = options.image;
	that.x = options.x;
	that.y = options.y;

	that.offset = {};

	var getCanvasPos = function (offset) {
		result = {};
		result.x = that.x - offset.x
		result.y = that.y - offset.y
		return result;
	}

	that.render = function (offset) {
		var canvasPos = getCanvasPos(offset);
		that.context.drawImage(
			that.image,
			0,
			0,
			that.width,
			that.height,
			canvasPos.x,
			canvasPos.y,
			that.width,
			that.height);
	};

	return that;
}

//Class for inivisible walls
//(walls are included in the map)
function CreateWall (options) {
	var that = {};
	that.role = "object";
	that.x1 = options.x1;
	that.y1 = options.y1;
	that.x2 = options.x2;
	that.y2 = options.y2;

	//Check if two lines intersect, used for checking collisions
	var lineIntersect = function(x1,y1,x2,y2, x3,y3,x4,y4) {
	    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
	    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
	    if (isNaN(x)||isNaN(y)) {
	        return false;
	    } else {
	        if (x1>=x2) {
	            if (!(x2<=x && x<=x1)) 
	            	return false;
	        } else {
	            if (!(x1<=x && x<=x2)) 
	            	return false;
	        }
	        if (y1>=y2) {
	            if (!(y2<=y && y<=y1)) 
	            	return false;
	        } else {
	            if (!(y1<=y && y<=y2)) 
	            	return false;
	        }
	        if (x3>=x4) {
	            if (!(x4<=x && x<=x3)) 
	            	return false;
	        } else {
	            if (!(x3<=x && x<=x4)) 
	            	return false;
	        }
	        if (y3>=y4) {
	            if (!(y4<=y && y<=y3)) 
	            	return false;
	        } else {
	            if (!(y3<=y && y<=y4)) 
	            	return false;
	        }
	    }
	    return true;
	}

	//Check if character has collided with the wall
	//Check if any of the characters edges intersects with the wall
	that.collision = function(newX, newY, character){
		var x1 = newX + character.buffer.left;
		var y1 = newY + character.buffer.up;
		var x2 = newX + character.width - character.buffer.right;
		var y2 = newY + character.buffer.up;

		var x3 = newX + character.width - character.buffer.right;;
		var y3 = newY + character.height - character.buffer.down;
		var x4 = newX + character.buffer.left;
		var y4 = newY + character.height - character.buffer.down;

		if(lineIntersect(that.x1, that.y1, that.x2, that.y2, x1, y1, x2, y2))
			return that;
		if(lineIntersect(that.x1, that.y1, that.x2, that.y2, x2, y2, x3, y3))
			return that;
		if(lineIntersect(that.x1, that.y1, that.x2, that.y2, x3, y3, x4, y4))
			return that;
		if(lineIntersect(that.x1, that.y1, that.x2, that.y2, x4, y4, x1, y1))
			return that;
		return false;
	}
	return that;
}

//Class to define area that triggers the textbox
function CreateTextArea(options) {
	var that = {};
	that.x1 = options.x1;
	that.y1 = options.y1;
	that.x2 = options.x2;
	that.y2 = options.y2;
	that.line1 = options.line1;
	that.line2 = options.line2;

	that.contains = function(player){
		if(player.x > that.x1 && player.x < that.x2 && player.y > that.y1 && player.y < that.y2)
			return true;
	}
	return that;
}