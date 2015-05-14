function character (options) {

	var animations = {
		stand: {width: 64, height: 64, x: 0, y: 0,  frames: 1, fps: 1,  delay: 0,    up: 0, left: 1, down: 2, right: 3, final: false},
		cast:  {width: 64, height: 64, x: 0, y: 0,  frames: 7, fps: 10, delay: 1000, up: 0, left: 1, down: 2, right: 3, final: false},
		walk:  {width: 64, height: 64, x: 0, y: 8,  frames: 9, fps: 30, delay: 0,    up: 0, left: 1, down: 2, right: 3, final: false},
		idle:  {width: 64, height: 64, x: 0, y: 4,  frames: 2, fps: 1,  delay: 0,    up: 0, left: 1, down: 2, right: 3, final: false},
		die:   {width: 64, height: 64, x: 0, y: 20, frames: 6, fps: 10, delay: 0,    up: 0, left: 0, down: 0, right: 0, final: true}
	};
	var getOffset = function(name, index){
		var current = animations[name];
		return ({
			x: (current.x + index)*current.width,
			y: (current.y + current[that.direction])*current.height,
			width: current.width,
			height: current.height
		});
	};

	var that = {};
	var frameIndex = 0;

	that.id = nextId++;
	that.context = options.context;
	that.width = options.width || 64;
	that.height = options.height || 64;

	that.buffer = {};
	that.buffer.up = 14;
	that.buffer.left = 17;
	that.buffer.right = 17;
	that.buffer.down = 2;

	that.image = options.image;
	that.x = options.x;
	that.y = options.y;
	that.maxSpeed = options.maxSpeed;
	that.ai = options.ai;
	that.directionX = 0; //characters walking direction 1, 0 or -1
	that.directionY = 0;

	that.lastAction = '';
	that.direction = "down";
	that.action  = "idle";
	that.offset = {};

	var lastRender = 0;
	var offset = getOffset(that.action , frameIndex);

	that.collision = function (newX, newY, character) {
		var collision = false;
		//Check that enemy isnt going off the canvas
		if(((newX + character.width - character.buffer.right) > map.w) ||
			(newX + character.buffer.left < 0) ||
			((newY + character.height - character.buffer.down) > map.h) ||
			(newY + character.buffer.up < 0))
			return "boundary";

		//Check for collisions with other characters
		var allObjects = characters.concat(objects);
		for(var i=0; i<allObjects.length;i++){
			var c = allObjects[i];
			if(c.id === character.id) //is this one
				continue;

			var dx = newX - c.x;
			var dy = newY - c.y;

			if(  (dx < c.width - c.buffer.right - character.buffer.left) 
				&& (dx > -character.width + character.buffer.right + c.buffer.left) 
				&& (dy < c.height - c.buffer.down - character.buffer.up) 
				&& (dy > -character.height + character.buffer.down + c.buffer.up))
				return c;
		}

		for(var i=0; i<walls.length;i++){
			var c = walls[i].collision(newX, newY, character);
			if(c){
				return c;
			}
		}

		return collision;
	}

	that.updateAnimationState = function (time) {
		if((time-lastRender)>(1000/animations[that.action ].fps)){
			// Move frameIndex to next frame 
			if(that.action  !== that.lastAction)
				frameIndex = 0;
			else{
				frameIndex++;
				if(frameIndex >= animations[that.action].frames)
					frameIndex = 0;
			}
			if(that.dying && frameIndex >= animations.die.frames-1){
				that.dead = true;
			}
			lastRender = time;
			that.lastAction = that.action;

			that.offset = getOffset(that.action, frameIndex);
		}
	}

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
			that.offset.x,
			that.offset.y,
			that.offset.width,
			that.offset.height,
			canvasPos.x,
			canvasPos.y,
			that.width,
			that.height);
	};

	return that;
}
