function createPlayer (options) {
	var that = sprite(options);
	that.role = "player";

	var lastUpdate = 0; //bad idea

	that.update = function (time, keys, clicked) {
		if(that.dying || that.dead || gameOver){
			that.action  = "die";
			return;
		}

		that.action  = "idle";
		var directionX = 0;
		var directionY = 0;
		if (keys[37] || keys[65]){
			that.action  = "walk";
			that.direction = "left";
			directionX = -1;
		}
		if (keys[38] || keys[87]){
			that.action  = "walk";
			that.direction = "up";
			directionY = -1;
		}
		if (keys[39] || keys[68]){
			that.action  = "walk";
			that.direction = "right";
			directionX = 1;
		}
		if (keys[40] || keys[83]){
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

		//Only update postion if no collision with a wall
		if(collision != "boundary"){
			that.x = newX;
			that.y = newY;
		}

		lastUpdate = time;

	};

	return that;
}