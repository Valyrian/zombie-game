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
	// that.type = options.type;
	that.ai = options.ai;
	that.directionX = 0; //that.direction 1, 0 or -1
	that.directionY = 0;

	that.lastAction = '';
	that.direction = "down";
	that.action  = "idle";

	var lastRender = 0;
	var offset = getOffset(that.action , frameIndex);

	that.collision = function (newX, newY, character) {
		var collision = false;
		//Check that enemy isnt going off the canvas
		if(((newX + character.width - character.buffer.right) > canvas.width) ||
			(newX + character.buffer.left < 0) ||
			((newY + character.height - character.buffer.down) > canvas.height) ||
			(newY + character.buffer.up < 0))
			collision = "boundary";

		//Check for collisions with other characters
		for(var i=0; i<characters.length;i++){
			c = characters[i];
			if(c.id === character.id) //is this one
				continue;

			var dx = newX - c.x;
			var dy = newY - c.y;

			if(  (dx < c.width - c.buffer.right - character.buffer.left) 
				&& (dx > -character.width + character.buffer.right + c.buffer.left) 
				&& (dy < c.height - c.buffer.down - character.buffer.up) 
				&& (dy > -character.height + character.buffer.down + c.buffer.up))
				collision = c;
		}
		return collision;
	}

	// Draw current sprite image
	that.render = function (time) {
		if((time-lastRender)>(1000/animations[that.action ].fps)){

			// Move frameIndex to next frame 
			if(that.action  !== that.lastAction)
				frameIndex = 0;
			else{
				frameIndex++;
				if(frameIndex >= animations[that.action ].frames)
					frameIndex = 0;
				lastRender = time;
			}
			if(that.dying && frameIndex >= animations.die.frames-1){
				that.dead = true;
			}
			that.lastAction = that.action;
			offset = getOffset(that.action , frameIndex);

		}
		that.context.drawImage(
			that.image,
			offset.x,
			offset.y,
			offset.width,
			offset.height,
			that.x,
			that.y,
			that.width,
			that.height);
	};

	return that;
}
