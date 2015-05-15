//Class for managing highscores
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

//Class for the game map
function gameMap(){
	that = {};
	that.image = new Image();
	that.image.src = 'images/map.png';
	that.w = 2975;
	that.h = 2897;

	//Get the position of the map, used for animation
	that.getOffsetX = function(posX, canvasW){
		var center = canvasW/2;
		var offset = posX - center;
		if(offset < 0)
			return 0;
		if(offset > that.w - canvasW)
			return canvasW;
		return offset;
	}
	that.getOffsetY = function(posY, canvasH){
		var center = canvasH/2;
		var offset = posY - center;
		if(offset < 0)
			return 0;
		if(offset > that.h - canvasH)
			return canvasH;
		return offset;
	}

	return that;
}
var map = gameMap();

//Class for controlling the audio
function audioManager(){
	that = {};
	var volume = 1;
	var sounds = [bite, growl, music];
	var paused = [];

	that.startGame = function(){
		for(var i = 0; i < sounds.length; i++){
			sound = sounds[i];
			sound.volume = volume;
		}
		growl.play();
		music.play();
	}

	that.endGame = function(){
		fade(music);
		bite.play();
	}

	//Pause all sounds when game is paused
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

	//Resume all sounds that were playing when game was paused
	that.resume = function(){
		for(var i = 0; i < paused.length; i++){
			sound = paused[i];
			sound.play();
		}
	}

	//Smoothly fade away a sound
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
		    	audio.pause();
		    	audio.currentTime = 0; //start from beginning
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
var walls = [];
var texts = [];
var activeText;
var game = game();

//A class for the game state
function game(){
	var enemies = 4;
	var enemyInteval = 1000; //ms
	that = {};

	//Start a new game
	var newGame = function(){
		gameOver = false;
		highScores.upToDate = false;
		score = 0;
		characters.length = 0;
		characters = new Array(enemies+1);
		// Create sprites
		player = createPlayer({
			context: canvas.getContext("2d"),
			maxSpeed: 100, //pixels per second
			x: 2440,
			y: 10,
			image: playerImage
		});
		characters[0] = player;

		characters[1] = createEnemy({
			ai: "ghost",
			context: canvas.getContext("2d"),
			maxSpeed: 50,
			x: 0,
			y: 2500,
			image: ghostImage
		});
		characters[2] = createEnemy({
			ai: "random",
			context: canvas.getContext("2d"),
			maxSpeed: 75,
			x: 500,
			y: 500,
			image: zombieImage
		});
		characters[3] = createEnemy({
			ai: "random",
			context: canvas.getContext("2d"),
			maxSpeed: 75,
			x: 1000,
			y: 1000,
			image: zombieImage
		});
		characters[4] = createEnemy({
			ai: "homing",
			context: canvas.getContext("2d"),
			maxSpeed: 75,
			x: 2800,
			y: 10,
			image: zombieImage2
		});

		// tree = CreateObject({
		// 	context: canvas.getContext("2d"),
		// 	x: 1000,
		// 	y: 1000,
		// 	image: treeImage
		// });
		// objects[0] = tree;

		$.getJSON("json/trees.json", function(data) {
			var tree;
		    for(var i = 0; i < data.length; i++){
		    	var options = data[i];
		    	options.image = treeImage;
		    	options.context = canvas.getContext("2d");
		    	tree = CreateObject(options);
		    	objects.push(tree);
	    	}
		});

		$.getJSON("json/walls.json", function(data) {
			var wall;
		    for(var i = 0; i < data.length; i++){
		    	wall = CreateWall(data[i]);
		    	walls.push(wall);
	    	}
		});

		var text;
		$.getJSON("json/flavor.json", function(data) {
		    for(var i = 0; i < data.length; i++){
		    	// console.log(i);
		    	text = CreateTextArea(data[i]);
		    	// console.log(text);
		    	texts.push(text);
	    	}
			text = CreateTextArea({
				x1: 0,
				y1: 0,
				x2: 3000,
				y2: 3000,
				line1: "",
				line2: ""
			});
			texts.push(text);
		});
		// text = CreateTextArea({
		// 	x1: 0,
		// 	y1: 0,
		// 	x2: 300,
		// 	y2: 300,
		// 	line1: "test",
		// 	line2: ""
		// });
		// texts[0] = CreateTextArea({
		// 	x1: 0,
		// 	y1: 0,
		// 	x2: 300,
		// 	y2: 300,
		// 	line1: "test1",
		// 	line2: ""
		// });
		// texts[1] = CreateTextArea({
		// 	x1: 300,
		// 	y1: 0,
		// 	x2: 2000,
		// 	y2: 300,
		// 	line1: "test2",
		// 	line2: ""
		// });
	}

	//Check if an enemy can be plased in the given coordinates
	var isFree = function(x, y, w, h){
		var b; //buffer zone so that enemies are not placed on player
		var bb; //buffer for buildings
		var allObjects = characters.concat(objects);
		
			//Spawn buffers for buildings and non-game-zone
			bb=64;
			if( y> (7800 - 3.08229*x))
				return false;
			if( y> (1180 + 0.517426*x ))
				return false;
			if((x < 1385+bb  ) && (x >= 0 ) && (y < 996+bb ) && (y >= 0 ))
				return false;
			if((x < 1692+bb ) && (x > 1507 -bb ) && (y < 157+bb ) && (y >= 0 ))
				return false;
			if((x < 1150+bb ) && (x > 410-bb ) && (y < 1645+bb ) && (y > 805-bb-bb ))
				return false;
			if((x < 2125+bb ) && (x > 1952-bb ) && (y < 1585+bb ) && (y > 1150-bb ))
				return false;
			if((x < 2690+bb ) && (x > 1995-bb ) && (y < 2450+bb ) && (y > 1585-bb ))
				return false;
		
		
		for(var i = 0; i < allObjects.length; i++){
			c = allObjects[i];
			if(c.role === "player")
				b = 300;
			else
				b = 0;
			var dx = x - c.x;
			var dy = y - c.y;

			if((dx < c.width + b) && (dx > -(w + b)) && (dy < c.height + b) && (dy > -(h + b) ))
				return false;
		}
		return true
	}

	//Add an enemy to a random postion
	var newEnemy = function(){
		var success = false;
		for(var i = 0; i < 100; i++){
			var x0 = Math.floor(Math.random()*(map.w-64));
			var y0 = Math.floor(Math.random()*(map.h-64));
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

	//Uupdate game state based on time
	function updateGame(time){
		var c;
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
		updateText();
		lastUpdate = time;
	}

	function updateAnimationState(time){
		for(var i = 0; i < characters.length;i++){
			c = characters[i];
			c.updateAnimationState(time);
		}
	}

	//Remove player at the end of the game
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

	//Tell al characters the game has ended
	function updateEnd(){
		for(var i = 0; i < characters.length;i++){
			c = characters[i];
			c.endGame();
		}
	}

	//Update the text box at the bottom of the screen, based on player location
	function updateText(){
		for(var i = 0; i < texts.length;i++){
			t = texts[i];
			if(t.contains(player)){
				activeText = t;
				return;
			}
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
		audioManager.startGame();
	}

	that.startNewGame = function(){
		instructions = false;
		audioManager.startGame();
		newGame();
	}

	that.endGame = function(){
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

//Main update loop for the game
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
		return
	}else{
		if((pressed["esc"] || pressed["p"]) && pauseRelesead) 
			game.pause();
	}
	if(gameOver && !highScores.upToDate)
		highScores.add(score);
	if(gameOver && pressed["enter"])
		game.startNewGame();
	if(gameOver)
		game.updateEnd();
	if(!gameOver && gameEnding)
		game.removePlayer();
	if(!gameOver && !gameEnding)
		game.updateGame(time);
	game.updateAnimationState(time);
}
