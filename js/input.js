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
		dy = mousePos.y - button.y;
		if((dx > 0) && (dx < button.w) && (dy > 0) && (dy < button.h)){
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