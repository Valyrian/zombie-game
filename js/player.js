function createPlayer (options) {
	var that = character(options);
	that.role = "player";

	// var lastUpdate = 0; //bad idea

	that.endGame = function () {
		that.action = "die";
	}

	// var getCanvasPos = function (offset) {
	// 	that.action = "die";
	// 	result = {};
	// 	result.x = that.x - offset.x
	// 	result.y = that.y - offset.y
	// 	return result;
	// }

	// that.render = function (offset) {
	// 	var canvasPos = getCanvasPos(offset);
	// 	that.context.drawImage(
	// 		that.image,
	// 		that.offset.x,
	// 		that.offset.y,
	// 		that.offset.width,
	// 		that.offset.height,
	// 		canvasPos.x,
	// 		canvasPos.y,
	// 		that.width,
	// 		that.height);
	// };

	that.update = function (time, lastUpdate, characters, clicked) {
		// if(that.dying || that.dead || gameOver){
		// 	that.action  = "die";
		// 	return;
		// }

		that.action  = "idle";
		var directionX = 0;
		var directionY = 0;
		if (pressed["left"] || pressed["a"]){
			that.action  = "walk";
			that.direction = "left";
			directionX = -1;
		}
		if (pressed["up"] || pressed["w"]){
			that.action  = "walk";
			that.direction = "up";
			directionY = -1;
		}
		if (pressed["right"] || pressed["d"]){
			that.action  = "walk";
			that.direction = "right";
			directionX = 1;
		}
		if (pressed["down"] || pressed["s"]){
			that.action  = "walk";
			that.direction = "down";
			directionY = 1;
		}

		//Calculate new position based on elapsed time
		// var collision;
		var elapsedTime = time - lastUpdate;
		var newX = that.x + Math.round(directionX*that.maxSpeed*(elapsedTime/1000));
		var newY = that.y + Math.round(directionY*that.maxSpeed*(elapsedTime/1000));

		// //Check that player isnt going off the canvas
		// if(((newX + that.width - that.buffer.right) > canvas.width) ||
		// 	(newX + that.buffer.left < 0) ||
		// 	((newY + that.height - that.buffer.down) > canvas.height) ||
		// 	(newY + that.buffer.up < 0))
		// 	collision = {};
		var collision = that.collision(newX, newY, that);
		var collisionX = that.collision(newX, that.y, that);
		var collisionY = that.collision(that.x, newY, that);

		//Only update postion if no collision with a wall

		if(!collision){
			that.x = newX;
			that.y = newY;
		}else if(collision === "boundary" || collision.role === "object"){
			if(!collisionX)
				that.x = newX;
			if(!collisionY)
				that.y = newY;
		}else if(collision.role === "enemy"){
			that.x = newX;
			that.y = newY;
		}

		lastUpdate = time;

	};

	return that;
}