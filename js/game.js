function highScores(){
	var scores;
	var stored = localStorage.getItem("highScores");
	var firebaseUrl = "https://zombie-game.firebaseio.com/.json";
	if(stored != null)
		scores = JSON.parse(stored);
	else
		scores = Array.apply(null, new Array(10)).map(function(){return 0}); //Populate array with 0 values
	
	var firebaseGet = function(){
		$.getJSON(firebaseUrl, function (data){
			scores = data;
		});
	}

	var firebaseSave = function(){
		var data = JSON.stringify(scores);
		$.ajax({
			url: firebaseUrl,
			type: 'PUT',
			data: data
		});
	}

	firebaseGet(firebaseUrl);

	var that = {}; 
	that.upToDate = false;
	that.get = function(){
		return scores;
	}

	that.add = function(score){
		that.upToDate = true;
		var oldLen = scores.length;
		scores.push(score);
		scores.sort(function(a,b) {return b - a;}); //sort descending
		scores.length = oldLen;
		localStorage.setItem("highScores", JSON.stringify(scores));
		firebaseSave();
	}

	that.isHighScore = function(score){
		return (score >= scores[scores.length-1])
	}
	return that;
}


var highScores = highScores();

// Load Sprite Sheets
var playerImage = new Image();
playerImage.src = "sprites/player.png";

var zombieImage = new Image();
zombieImage.src = "sprites/zombie_r.png";

var zombieImage2 = new Image();
zombieImage2.src = "sprites/zombie_g.png";

var ghostImage = new Image();
ghostImage.src = "sprites/ghost.png";

var treeImage = new Image();
treeImage.src = "sprites/tree.png";

var bite = new Audio('audio/bite.mp3');
var growl = new Audio('audio/growl.mp3');
var music = new Audio('audio/music.mp3');

function audioManager(){
	that = {};
	// that.bite = new Audio('audio/bite.mp3');
	// that.growl = new Audio('audio/growl.mp3');
	// that.music = new Audio('audio/music.mp3');

	var sounds = [bite, growl, music];
	var paused = [];

	that.startGame = function(){
		growl.play();
		music.play();
	}

	that.endGame = function(){
		// music.pause();
		fade(music);
		bite.play();
	}

	that.pause = function(){
		paused = [];
		for(var i = 0; i < sounds.length; i++){
			sound = sounds[i];
			if(!sound.paused){
				sound.pause();
				paused.push(sound);
			}
		}
	}

	that.resume = function(){
		for(var i = 0; i < paused.length; i++){
			sound = paused[i];
			sound.play();
		}
	}

	var fade = function(audio){
		var vol = 1;
		var interval = 20;
		var step = 0.05;

		var fadeout = setInterval(
		  function() {
		    if (vol > step) {
		      vol -= step;
		      audio.volume = vol;
		    }
		    else {
		    	vol = 0;
		    	audio.volume = vol;
		      clearInterval(fadeout);
		    }
		  }, interval);
	}

	return that;
}

audioManager = audioManager();


nextId = 0; //global variable for creating unique ids for characters

var score;
var player;
gameOver = false;

var characters = [];
var objects = [];
var game = game();

function game(){
	var enemies = 4;
	var enemyInteval = 1000; //ms
	that = {};

	var newGame = function(){
		gameOver = false;
		highScores.upToDate = false;
		score = 0;
		characters.length = 0;
		characters = new Array(enemies+1);
		// Create sprites
		player = createPlayer({
			// type: "human",
			context: canvas.getContext("2d"),
			maxSpeed: 100, //pixels per second
			x: canvas.width/2-32,
			y: canvas.height/2-32,
			image: playerImage
		});
		characters[0] = player;

		characters[1] = createEnemy({
			ai: "random",
			context: canvas.getContext("2d"),
			maxSpeed: 50,
			x: 0,
			y: 0,
			image: zombieImage
		});
		characters[2] = createEnemy({
			ai: "random",
			context: canvas.getContext("2d"),
			maxSpeed: 50,
			x: canvas.width-64,
			y: 0,
			image: zombieImage
		});
		characters[3] = createEnemy({
			ai: "random",
			context: canvas.getContext("2d"),
			maxSpeed: 50,
			x: canvas.width-64,
			y: canvas.height-64,
			image: zombieImage
		});
		characters[4] = createEnemy({
			ai: "homing",
			context: canvas.getContext("2d"),
			maxSpeed: 50,
			x: 0,
			y: canvas.height-64,
			image: zombieImage2
		});

		tree = CreateObject({
			context: canvas.getContext("2d"),
			x: 100,
			y: 100,
			image: treeImage
		});
		objects[0] = tree;
	}

	var isFree = function(x, y, w, h){
		var b; //buffer zone so that enemies are not placed on player
		var allObjects = characters.concat(objects);
		for(var i = 0; i < allObjects.length; i++){
			c = allObjects[i];
			if(c.role === "player")
				b = 64;
			else
				b = 0;
			var dx = x - c.x;
			var dy = y - c.y;

			if((dx < c.width + b) && (dx > -(w + b)) && (dy < c.height + b) && (dy > -(h + b) ))
				return false;
		}
		return true
	}

	var newEnemy = function(){
		var success = false;
		for(var i = 0; i < 100; i++){
			var x0 = Math.floor(Math.random()*(canvas.width-64));
			var y0 = Math.floor(Math.random()*(canvas.height-64));
			if(isFree(x0, y0, 64, 64)){
				success = true;
				score++;
				break;
			}
		}
		if(success){
			var enemy = createEnemy({
				ai: "random",
				context: canvas.getContext("2d"),
				maxSpeed: 50,
				x: x0,
				y: y0,
				image: zombieImage
			});
			characters.push(enemy);
		}
	}
	
	var lastUpdate = 0;
	var lastEnemy; //time the latest enemy was created
	function updateGame(time){
		var c;
		// if(pressed["esc"] || pressed["p"]){		
		// 	console.log("pause");
		// 	paused = true;
		// }
		if(!lastEnemy)
			lastEnemy = time;
		if(time-lastEnemy > enemyInteval){
			newEnemy();
			lastEnemy = time;
		}
		for(var i = 0; i < characters.length;i++){
			c = characters[i];
				c.update(time, lastUpdate, characters, clicked[i]);
			if(c.dead)
				characters.splice(i, 1); //remove chracter if dead
			clicked[i]=false;
		}
		lastUpdate = time;
	}

	// var lastUpdate = 0;
	function updateAnimationState(time){
		// console.log(lastUpdate);
		for(var i = 0; i < characters.length;i++){
			c = characters[i];
			c.updateAnimationState(time);
		}
		// lastUpdate = time;
	}


	function removePlayer(){
		for(var i = 0; i < characters.length;i++){
			c = characters[i];
			if(c.role === "player" && c.dead){
				characters.splice(i, 1);
				gameOver = true;
				gameEnding = false;
			}
		}
	}

	function updateEnd(){
		for(var i = 0; i < characters.length;i++){
			c = characters[i];
			c.endGame();
		}
	}

	var released = false;
	that.pause = function(){
		audioManager.pause();
		paused = true;
		pauseRelesead = false;
	}

	that.resume = function(time){
		audioManager.resume();
		paused = false;
		lastUpdate = time;
		pauseRelesead = false;
	}

	that.startGame = function(){
		instructions = false;
		// growl.play();
		audioManager.startGame();
	}

	that.endGame = function(){
		// bite.play();
		audioManager.endGame();
	}

	that.newGame = newGame;
	that.updateEnd = updateEnd;
	that.removePlayer = removePlayer;
	that.updateGame = updateGame;
	that.updateAnimationState = updateAnimationState;
	
	that.init  = function(){
		newGame();
	}
	return that;
}
game.init();


var startMenu = false;
var instructions = true;
var paused = false;
gameEnding = false; //final dying animation

var pauseRelesead = false;


function update(time){
	if(instructions){
		if(pressed["enter"]) 
			game.startGame();
		return;
	}
	if(!pressed["esc"] && !pressed["p"]) 
		pauseRelesead = true;
	if(paused){
		if((pressed["esc"] || pressed["p"]) && pauseRelesead) 
			game.resume(time);
		// console.log("unpause");
		return
	}else{
		if((pressed["esc"] || pressed["p"]) && pauseRelesead) 
			game.pause();
	}
	if(gameOver && !highScores.upToDate)
		highScores.add(score);
	if(gameOver && pressed["enter"])
		game.newGame();
	if(gameOver)
		game.updateEnd();
	if(!gameOver && gameEnding)
		game.removePlayer();
	if(!gameOver && !gameEnding)
		game.updateGame(time);
	game.updateAnimationState(time);
}

