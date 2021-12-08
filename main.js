let fastMode = false; // If fast mode is active launch a loop that only simulate
let width, height; // Dimentions of the canvas

// Wait for the window to be fully loaded before launching the game
window.requestAnimationFrame(_init);

// Init and launch the loop
function _init()
{
	update_canvas_size();
	init();
	
	if (fastMode) { computeLoop(); }
	else { interactiveLoop(); }
}

// 
function interactiveLoop()
{
	simulate();
	draw();

	if (running) {
		window.requestAnimationFrame(interactiveLoop);
	}
}

// 
function computeLoop()
{
	while (running) {
		simulate();
	}
}

// Callback to update the canvas size
function update_canvas_size()
{
	let canvas = document.getElementById('canvas');

	// Update the canvas size
	canvas.width = canvas.parentElement.offsetWidth;
	canvas.height = canvas.parentElement.offsetHeight;
	
	width = canvas.width;
	height = canvas.height;

	// console.log(width, height);
}

window.addEventListener('resize', update_canvas_size);
