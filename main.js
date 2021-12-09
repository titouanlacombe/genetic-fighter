let running = true; // If false stops the loops
let global_objects;
let width, height; // Dimentions of the canvas

// Init and launch the loop
function _init()
{
	update_canvas_size();
	global_objects = init();
	loop();
}

function loop(dt)
{
	dt = 1; // fix delta time to a constant

	simulate(dt, global_objects);
	draw(global_objects);

	if (running) {
		window.requestAnimationFrame(loop);
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

// Wait for the window to be fully loaded before launching the game
window.requestAnimationFrame(_init);
