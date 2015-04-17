function createEnemy (options) {
	var that = sprite(options);
	that.dying = false;
	that.dead = false;
	that.role = "enemy";

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
	}

	var updateOrientation = function(){
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
	updateOrientation();

	that.update = function (time, characters, clicked) {
		if(clicked)
			that.dying = true;
		if(that.dying){
			that.action = "die";
			return;
		}

		if(gameOver){
			that.action = "cast";
			return;
		}

		that.action = "walk";

		var elapsedTime = time - lastUpdate;
		var newX = that.x + Math.round(directionX*that.maxSpeed*(elapsedTime/1000));
		var newY = that.y + Math.round(directionY*that.maxSpeed*(elapsedTime/1000));

		var collision = that.collision(newX, newY, that);

		//Only update postion if no collision is detected
		if(!collision){
			that.x = newX;
			that.y = newY;
		}else if(collision.role === "player"){
			collision.action = "die";
			collision.dying = true;
			gameOver = true;
		}else{
			randomizeDirection();
			updateOrientation();
		}

		lastUpdate = time;

	};

	return that;
}