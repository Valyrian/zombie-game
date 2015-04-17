
// Load Sprite Sheets
var playerImage = new Image();
playerImage.src = "sprites/player.png";

var zombieImage = new Image();
zombieImage.src = "sprites/zombie.png";

nextId = 0; //global variable for creating unique ids for characters

var enemies = 4;
var score;
var enemyInteval = 1000; //ms
var player;
var highScoresUpdated;

var stored = localStorage.getItem("highScores");
if(stored != null)
	highScores = JSON.parse(stored);
else
	var highScores = Array.apply(null, new Array(10)).map(function(){return 0}); //Populate array with 0 values

initGame();
// var container = $(canvas).parent();


var characters = [];
var initGame = function(){
	gameOver = false;
	highScoresUpdated = false;
	score = 0;
	characters.length = 0;
	characters = new Array(enemies+1);
	// Create sprites
	player = createPlayer({
		type: "player",
		context: canvas.getContext("2d"),
		maxSpeed: 100, //pixels per second
		x: canvas.width/2-32,
		y: canvas.height/2-32,
		image: playerImage
	});
	characters[0] = player;

	characters[1] = createEnemy({
		type: "enemy",
		context: canvas.getContext("2d"),
		maxSpeed: 50,
		x: 0,
		y: 0,
		image: zombieImage
	});
	characters[2] = createEnemy({
		type: "enemy",
		context: canvas.getContext("2d"),
		maxSpeed: 50,
		x: canvas.width-64,
		y: 0,
		image: zombieImage
	});
	characters[3] = createEnemy({
		type: "enemy",
		context: canvas.getContext("2d"),
		maxSpeed: 50,
		x: canvas.width-64,
		y: canvas.height-64,
		image: zombieImage
	});
	characters[4] = createEnemy({
		type: "enemy",
		context: canvas.getContext("2d"),
		maxSpeed: 50,
		x: 0,
		y: canvas.height-64,
		image: zombieImage
	});
}

var isFree = function(x, y, w, h){
	var b; //buffer zone so that enemies are not placed on player
	for(var i = 0; i < characters.length; i++){
		c = characters[i];
		if(c.type === "player")
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
			type: "enemy",
			context: canvas.getContext("2d"),
			maxSpeed: 50,
			x: x0,
			y: y0,
			image: zombieImage
		});
		characters.push(enemy);
	}
}

var lastEnemy; //time the latest enemy was created

function update(time){
	updateGame(time);
}

function updateGame(time){
	var c;
	if(gameOver && !highScoresUpdated){
		highScoresUpdated = true;
		var oldLen = highScores.length;
		highScores.push(score);
		highScores.sort(function(a,b) {return b - a;}); //sort descending
		highScores.length = oldLen;
		localStorage.setItem("highScores", JSON.stringify(highScores));
	}
	if(gameOver && keys[13])
		initGame();
	if(!lastEnemy)
		lastEnemy = time;
	if(time-lastEnemy > enemyInteval && !gameOver){
		newEnemy();
		lastEnemy = time;
	}
	for(var i = 0; i < characters.length;i++){
		c = characters[i];
		if(c.type === "player")
			c.update(time, keys, clicked[i]);
		else if(c.type === "enemy")
			c.update(time, characters, clicked[i]);
		if(c.dead)
			characters.splice(i, 1); //remove chracter if dead
		clicked[i]=false;
	}
}
