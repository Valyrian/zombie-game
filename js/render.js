
function clear(){
	context.clearRect(0, 0, canvas.width, canvas.height);
}

var grass = new Image();
grass.src = 'sprites/grass.png';

function render(time){
	var pattern = context.createPattern(grass, 'repeat');
  context.fillStyle = pattern;
  context.fillRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < characters.length;i++){
		characters[i].render(time);
	}

  renderHud();

  for(var i=0; i<buttons.length;i++)
  	buttons[i].render();

  if(gameOver){
  	renderHighScores(score);
  }
}

var renderHighScores = function(newScore){
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
}

var padInt = function(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
}

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
