
function clear(){
	context.clearRect(0, 0, canvas.width, canvas.height);
}

var grass = new Image();
grass.src = 'sprites/grass.png';

function render(time){
 	var offset = {};
 	offset.x = map.getOffsetX(player.x, canvas.width)
	offset.y = map.getOffsetY(player.y, canvas.height)
 	renderMap(offset);

	for(var i = 0; i < characters.length;i++){
		characters[i].render(offset);
	}

	for(var i = 0; i < objects.length;i++){
		objects[i].render(offset);
	}

	renderTextBox(activeText);

	renderHud();

	if(gameOver){
		renderHighScores(score);
	}

	if(instructions)
		renderInstructions();

	if(paused)
		renderPaused();

}

var renderTextBox = function(activeText){
	try{
		var line1 = activeText.line1 || "";
		var line2 = activeText.line2 || "";
	}catch(e){
		var line1 = "";
		var line2 = "";
	}
	context.fillStyle="rgba(128, 128, 128, 0.8)";
	context.fillRect(0, canvas.height-60, canvas.width, 60);

	context.fillStyle = "white";
	context.font = "bold 15px Arial";
	context.textAlign="left";
	context.textBaseline = "bottom";
	context.fillText(line1, 110, canvas.height-10);
	context.fillText(line2, 110, canvas.height-30);
}

var renderMap = function(offset){
	context.drawImage(map.image, -offset.x, -offset.y);
	mapW = 2975;
	mapH = 2897;
}


var renderPaused = function(newScore){
	context.fillStyle="rgba(128, 128, 128, 0.5)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "white";
	context.font = "bold 100px Arial";
	context.textAlign="center";
	context.textBaseline = "middle";
	context.fillText("Game paused", canvas.width/2, canvas.height/2);
}

var renderInstructions = function(newScore){
	context.fillStyle="rgba(128, 128, 128, 0.8)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	var instructions = new Image();
	instructions.src = "images/instructions.png";
	context.drawImage(instructions,100,100);

	context.fillStyle = "white";
	context.font = "bold 20px Arial";
	context.textAlign="center";
	context.textBaseline = "top";
	context.fillText("Press enter to start playing", canvas.width/2, 500);
}

var renderHighScores = function(newScore){
	var message = "";
	if(highScores.isHighScore(newScore)){
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

	var scores = highScores.get();
	var newFound = false;
	var newIndex = scores.indexOf(newScore);

	for(var i=0; i<scores.length;i++){
		var score = scores[i]
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
	context.fillText("Press enter to play again", canvas.width/2, 120 + 20 + scores.length*25);
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
}

// var buttons = [];

// var createButton = function(text0, x0, y0, w0, h0){
// 	var that = {};
// 	that.text = text0;
// 	that.x = x0;
// 	that.y = y0 || (canvas.height-20-1);
// 	that.w = w0 || 20;
// 	that.h = h0 || 20;

// 	that.clicked = false;

// 	that.render = function(){
// 		context.textBaseline = "top";
// 		context.fillText(that.text, that.x+that.w/2, that.y);
// 		context.textAlign="center";

// 		context.rect(that.x, that.y, that.w, that.h);
// 		context.stroke();
// 	}

// 	return that;
// }

// var button1 = createButton("-", canvas.width/2-50);

// buttons.push(button1);
// var button2 = createButton("+", canvas.width/2+30);
// buttons.push(button2);
