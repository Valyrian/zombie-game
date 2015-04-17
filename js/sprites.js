function sprite (options) {

	
	var animations = {
		stand: {width: 64, height: 64, x: 0, y: 0,  frames: 1, fps: 1,  delay: 0,    up: 0, left: 1, down: 2, right: 3},
		cast:  {width: 64, height: 64, x: 0, y: 0,  frames: 7, fps: 10, delay: 1000, up: 0, left: 1, down: 2, right: 3},
		walk:  {width: 64, height: 64, x: 0, y: 8,  frames: 9, fps: 30, delay: 0,    up: 0, left: 1, down: 2, right: 3},
		idle:  {width: 64, height: 64, x: 0, y: 4,  frames: 2, fps: 1,  delay: 0,    up: 0, left: 1, down: 2, right: 3},
		die:   {width: 64, height: 64, x: 0, y: 20, frames: 6, fps: 10, delay: 0,    up: 0, left: 0, down: 0, right: 0}
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
	that.type = options.type;
	that.directionX = 0; //that.direction 1, 0 or -1
	that.directionY = 0;

	that.lastAction = '';
	that.direction = "down";
	that.action  = "idle";

	var lastRender = 0;
	var offset = getOffset(that.action , frameIndex);

	// // var lastUpdate = 0; //bad idea
	// that.collision = function (newX, newY, characters) {
	// 	var collision;
	// 	// var elapsedTime = time - lastUpdate;
	// 	// var newX = that.x + Math.round(directionX*that.maxSpeed*(elapsedTime/1000));
	// 	// var newY = that.y + Math.round(directionY*that.maxSpeed*(elapsedTime/1000));

	// 	//Check that player isnt going off the canvas
	// 	if(((newX + that.width) > canvas.width) ||
	// 		(newX < 0) ||
	// 		((newY + that.height) > canvas.height) ||
	// 		(newY < 0))
	// 		collision = {};

	// 	// lastUpdate = time;
	// 	return(collision);
	// }

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
