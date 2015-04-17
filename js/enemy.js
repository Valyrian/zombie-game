function createEnemy (options) {
	var that = sprite(options);
	that.dying = false;
	that.dead = false;

	// that.maxSpeed = 50; //pixels per second

	var lastUpdate = 0; //bad idea
	var directionX = 0;
	var directionY = 0;

	var randomizeDirection = function(){
		directionX = 0;
		directionY = 0;
		var num = Math.floor(Math.random()*8);
		if(num > 0 && num < 4)
			directionX = 1;
		if(num > 4)
				directionX = -1;
		if(num > 6 || num < 2)
			directionY = -1;
		if(num > 2 && num < 6)
			directionY = 1;

		if(directionY === -1)
			that.direction = "up";
		else if(directionX === -1)
			that.direction = "left";
		else if(directionX === 1)
			that.direction = "right";
		else
			that.direction = "down";

	}
	randomizeDirection();

	that.update = function (time, characters, clicked) {
		if(clicked)
			that.dying = true;
		if(that.dying){
			that.action = "die";
			return;
		}

		// var player = characters[0];
		if(playerDead){
			that.action = "cast";
			return;
		}

		that.action = "walk";

		// var directionX = 0;
		// var directionY = 0;

		// var maxRandom = 100;

		// var dx = that.x - player.x + ((Math.random() * maxRandom) - maxRandom);
		// var dy = that.y - player.y + ((Math.random() * maxRandom) - maxRandom);

		// if(dx > 0)
		// 	directionX = -1;
		// if(dx < 0)
		// 	directionX = 1;
		// if(dy > 0)
		// 	directionY = -1;
		// if(dy < 0)
		// 	directionY = 1;

		// if(Math.abs(dx) > Math.abs(dy)){
		// 	if(directionX === 1)
		// 		that.direction = "right"
		// 	else
		// 		that.direction = "left"
		// }else{
		// 	if(directionY === 1)
		// 		that.direction = "down"
		// 	else
		// 		that.direction = "up"
		// }
		//Calculate new position based on elapsed time
		var collision = false;
		var elapsedTime = time - lastUpdate;
		var newX = that.x + Math.round(directionX*that.maxSpeed*(elapsedTime/1000));
		var newY = that.y + Math.round(directionY*that.maxSpeed*(elapsedTime/1000));

		//Check that enemy isnt going off the canvas
		if(((newX + that.width - that.buffer.right) > canvas.width) ||
			(newX + that.buffer.left < 0) ||
			((newY + that.height - that.buffer.down) > canvas.height) ||
			(newY + that.buffer.up < 0))
			collision = {};

		for(var i=0; i<characters.length;i++){
			c = characters[i];
			if(c.id === that.id) //is this one
				continue;

			var dx = newX - c.x;
			var dy = newY - c.y;

			if(  (dx < c.width - c.buffer.right - that.buffer.left) 
				&& (dx > -that.width + that.buffer.right + c.buffer.left) 
				&& (dy < c.height - c.buffer.down - that.buffer.up) 
				&& (dy > -that.height + that.buffer.down + c.buffer.up))
				collision = c;
		}


		


		//Only update postion if no collision is detected
		if(!collision){
			that.x = newX;
			that.y = newY;
		}else if(collision.type === "player"){
			collision.action = "die";
			collision.dying = true;
			playerDead = true;
		}else{
			randomizeDirection();
			// console.log(directionX, directionY)
		}

		lastUpdate = time;

	};

	return that;
}