// Get Canvas and Context
canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

// Animate to next frame
function animate(time){
	clear();
	update(time);
	render(time);
	animationFrame = requestAnimationFrame(animate);
}

// Document ready -> Load sprite sheet image
$(document).ready(loadImage);

// Image loaded -> start animation
function loadImage(){
	playerImage.onload = function() { 
		animationFrame = requestAnimationFrame(animate);
	};
}