function createEnemy (options) {
	var that = character(options);
	that.dying = false;
	that.dead = false;
	that.role = "enemy";

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

	var homingDirection = function(){
		directionX = 0;
		directionY = 0;
		var margin = 10;
		var dx = player.x - that.x
		var dy = player.y - that.y
		if(dx > margin)
			directionX = 1;
		if(dx < -margin)
			directionX = -1;
		if(dy > margin)
			directionY = 1;
		if(dy < -margin)
			directionY = -1;
	}

	var changeDirection = function(collisionX, collisionY, newX, newY){
		if(that.ai === "homing"){
			homingDirection();
			if(directionX != 0 && !collisionX)
				that.x = newX;
			else if(directionY != 0 && !collisionY)
				that.y = newY;
		}else if(that.ai === "ghost"){
			homingDirection();
			that.x = newX;
			that.y = newY;
		}else
			randomizeDirection();
		updateOrientation();
	}

	var getDirection = function(){
		if(that.ai === "homing")
			homingDirection();
		else if(that.ai === "ghost")
			homingDirection();
		else
			randomizeDirection();
		updateOrientation();
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

	getDirection();

	that.endGame = function () {
		that.action = "cast";
	}

	that.update = function (time, lastUpdate, characters, clicked) {
		if(clicked)
			that.dying = true;
		if(that.dying){
			that.action = "die";
			return;
		}

		if(that.ai === "homing" || that.ai === "ghost")
			getDirection();

		that.action = "walk";

		
		var elapsedTime = time - lastUpdate;
		var newX = that.x + Math.round(directionX*that.maxSpeed*(elapsedTime/1000));
		var newY = that.y + Math.round(directionY*that.maxSpeed*(elapsedTime/1000));

		var collision = that.collision(newX, newY, that);
		var collisionX = that.collision(newX, that.y, that);
		var collisionY = that.collision(that.x, newY, that);

		//Only update postion if no collision is detected
		if(!collision){
			that.x = newX;
			that.y = newY;
		}else if(collision.role === "player"){
			collision.action = "die";
			collision.dying = true;
			gameEnding = true;
			game.endGame();
		}else if(collision.role === "enemy" && collision.ai === "ghost"){
			that.x = newX;
			that.y = newY;
		}else{
			changeDirection(collisionX, collisionY, newX, newY);
		}

		lastUpdate = time;

	};

	return that;
}