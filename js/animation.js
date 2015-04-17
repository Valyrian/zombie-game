
// Load Sprite Sheet
var playerImage = new Image();
playerImage.src = "sprites/player.png";

var zombieImage = new Image();
zombieImage.src = "sprites/zombie.png";

nextId = 0;

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

// Get Canvas and Context
canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var container = $(canvas).parent();

var characters = [];

var initGame = function(){
	playerDead = false;
	highScoresUpdated = false;
	score = 0;
	characters.length = 0;
	characters = new Array(enemies+1);
	// Create sprite
	player = createPlayer({
		// id: 0,
		type: "player",
		context: canvas.getContext("2d"),
		maxSpeed: 100, //pixels per second
		x: canvas.width/2-32,
		y: canvas.height/2-32,
		image: playerImage
	});
	characters[0] = player;

	characters[1] = createEnemy({
		// id: 1,
		type: "enemy",
		context: canvas.getContext("2d"),
		maxSpeed: 50,
		x: 0,
		y: 0,
		image: zombieImage
	});
	characters[2] = createEnemy({
		// id: 2,
		type: "enemy",
		context: canvas.getContext("2d"),
		maxSpeed: 50,
		x: canvas.width-64,
		y: 0,
		image: zombieImage
	});
	characters[3] = createEnemy({
		// id: 3,
		type: "enemy",
		context: canvas.getContext("2d"),
		maxSpeed: 50,
		x: canvas.width-64,
		y: canvas.height-64,
		image: zombieImage
	});
	characters[4] = createEnemy({
		// id: 4,
		type: "enemy",
		context: canvas.getContext("2d"),
		maxSpeed: 50,
		x: 0,
		y: canvas.height-64,
		image: zombieImage
	});
}
initGame();

var isFree = function(x, y, w, h){
	var b; //buffer zone
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
		// var x0 = Math.floor(Math.random()*2)*(canvas.width-64);
		// var y0 = Math.floor(Math.random()*2)*(canvas.height-64);
		var x0 = Math.floor(Math.random()*(canvas.width-64));
		var y0 = Math.floor(Math.random()*(canvas.height-64));
		if(isFree(x0, y0, 64, 64)){
			// console.log("inset");
			success = true;
			score++;
			break;
		}
		// else
		// 	console.log("fail");
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



function clear(){
	context.clearRect(0, 0, canvas.width, canvas.height);
}

var lastEnemy;

function update(time){
	var c;
	if(playerDead && !highScoresUpdated){
		highScoresUpdated = true;
		var oldLen = highScores.length;
		highScores.push(score);
		highScores.sort(function(a,b) {return b - a;});
		highScores.length = oldLen;
		localStorage.setItem("highScores", JSON.stringify(highScores));
	}
	if(playerDead && keys[13])
		initGame();
	if(!lastEnemy)
		lastEnemy = time;
	if(time-lastEnemy > enemyInteval && !playerDead){
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

var grass = new Image();
grass.src = 'sprites/grass.png';
// var pattern = context.createPattern(grass, 'repeat');

function render(time){
	var pattern = context.createPattern(grass, 'repeat');
  context.fillStyle = pattern;
  context.fillRect(0, 0, canvas.width, canvas.height);


	for(var i = 0; i < characters.length;i++){
		characters[i].render(time);
	}


  // context.textAlign="center";

  renderHud();

  for(var i=0; i<buttons.length;i++)
  	buttons[i].render();

 //  context.beginPath();
	// context.lineWidth="1";
  // context.rect(canvas.width/2-50, canvas.height-20-1, 20, 20);
  // context.stroke();

  // context.textBaseline = "top";
  // context.textAlign="left";
  // context.fillText("-", canvas.width/2-50, canvas.height-20-1);

  // context.rect(canvas.width/2+30, canvas.height-20-1, 20, 20);
  // context.stroke();

  // context.fillText("+", canvas.width/2+30, canvas.height-20-1);
  // context.textAlign="center";
  

  if(playerDead){
  	renderHighScores(score);
  }
}

var renderHighScores = function(newScore){
	//If new high score
	// console.log(highScores);
	var message = "";
	if(newScore >= highScores[highScores.length-1]){
		context.fillStyle = "white";
		message = "High Score!";
	}else{
		context.fillStyle = "red";
		message = "You lost!";
	}
  context.font = "bold 100px Arial";
  context.textAlign="center";
  context.textBaseline = "top";
  context.fillText(message, canvas.width/2, 0);

	var newFound = false;
	var newIndex = highScores.indexOf(newScore);
	// if(newIndex > 0)
	// 	console.log("highScore");

	for(var i=0; i<highScores.length;i++){
		var score = highScores[i]
		message = "# " + padInt(i+1, 2) + ".    " + padInt(score, 4);
		if(i === newIndex && !newFound){
			context.fillStyle = "red";
			newFound = true;
		}else
			context.fillStyle = "white";
	  context.font = "bold 20px Arial";
	  context.textAlign="center";
	  context.textBaseline = "top";
	  context.fillText(message, canvas.width/2, 120 + i*25);
	}

	context.fillStyle = "white";
  context.font = "bold 20px Arial";
  context.textAlign="center";
  context.textBaseline = "top";
  context.fillText("Press enter to play again", canvas.width/2, 120 + 20 + highScores.length*25);
  	// buttons[i].render();
}

var padInt = function(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
}

// var renderEndText = function(){
// 	context.fillStyle = "red";
//   context.font = "bold 100px Arial";
//   context.textAlign="center";
//   context.textBaseline = "top";
//   context.fillText("You lost!", canvas.width/2, 0);
// }

var renderHud = function(){
	context.fillStyle = "black";
  context.font = "bold 20px Arial";
  context.textAlign="left";
  context.textBaseline = "top";
  context.fillText("Score " + score.toString(), 0, 0);

	context.fillStyle = "black";
  context.font = "bold 20px Arial";
  context.textAlign="center";
  context.textBaseline = "bottom";
  context.fillText("Speed", canvas.width/2, canvas.height-20);

  context.fillStyle = "black";
  context.font = "bold 20px Arial";
  context.textAlign="center";
  context.textBaseline = "bottom";
  context.fillText(player.maxSpeed, canvas.width/2, canvas.height);
}

var buttons = [];

var createButton = function(text0, x0, y0, w0, h0){
	var that = {};
	that.text = text0;
	that.x = x0;
	that.y = y0 || (canvas.height-20-1);
	that.w = w0 || 20;
	that.h = h0 || 20;

	that.clicked = false;

	that.render = function(){
		context.textBaseline = "top";
		context.fillText(that.text, that.x+that.w/2, that.y);
		context.textAlign="center";

		context.rect(that.x, that.y, that.w, that.h);
		context.stroke();
	}

	return that;
}

var button1 = createButton("-", canvas.width/2-50);

buttons.push(button1);
var button2 = createButton("+", canvas.width/2+30);
buttons.push(button2);


// Animate to next frame
function animate(time){
		clear();
		update(time);
		render(time);
	animationFrame = requestAnimationFrame(animate);
}

// Document ready -> Load sprite sheet image
$( document ).ready(loadImage);

// Image loaded -> start animation
function loadImage(){
	playerImage.onload = function() { 
		animationFrame = requestAnimationFrame(animate);
	};
}

var keys = [];
[37, 38, 39, 40, 65, 87, 68, 83, 13]
document.body.addEventListener("keydown", function (e) {
	if([37, 38, 39, 40, 65, 87, 68, 83, 13].indexOf(e.keyCode) > -1)
		e.preventDefault();
  keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
	// e.preventDefault();
  keys[e.keyCode] = false;
});

function getMousePos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	// console.log(e.clientX, e.clientY);
	// console.log(rect.left, rect.top);
	// console.log(canvas.width, canvas.height);
	// console.log(rect.width, rect.height);
	return {
		x: (e.clientX-rect.left)*(canvas.width/rect.width),
		y: (e.clientY-rect.top)*(canvas.height/rect.height)
	};
}

var clicked = Array.apply(null, new Array(5)).map(function(){return false}); //Populate array with false values

canvas.addEventListener("mousedown", function(e) {
	var mousePos = getMousePos(canvas, e);
	var dx, dy;

	for(var i=0; i<buttons.length; i++){
		button = buttons[i];
		dx = mousePos.x - button.x;
		// console.log(dx);
		dy = mousePos.y - button.y;
		// console.log(dx, dy);
		if((dx > 0) && (dx < button.w) && (dy > 0) && (dy < button.h)){
			// console.log(button.text);
			// button.clicked = true;
			if(i===0)
				player.maxSpeed-=5;
			else
				player.maxSpeed+=5;

		}
	}

	for(var i=0; i<characters.length; i++){
		c = characters[i];
		dx = mousePos.x - c.x;
		dy = mousePos.y - c.y;
		if((dx > 0) && (dx < c.width) && (dy > 0) && (dy < c.height)){
			clicked[i] = true;
		}
	}
}, false);

// canvas.addEventListener("mouseup", function(e) {
// 	var mousePos = getMousePos(canvas, e);
// }, false);