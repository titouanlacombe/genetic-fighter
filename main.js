let width, height; // Dimentions of the canvas
let global_objects; // State of the simulation
let running = true; // If false stops the loops
let frame = 0; // Number of the current frame
let previous_time = 0;


// Init and launch the loop
function _init() {
	update_canvas_size();
	global_objects = init();
	loop();
}

function loop(time) {
	let dt;
	// console.log((time - previous_time));
	dt = (time - previous_time) / 16;
	previous_time = time;
	console.log(dt);
	// dt = 1; // fix delta time to a constant


	simulate(dt, global_objects);
	draw(global_objects);

	// console.log(frame);
	frame++;

	if (running) {
		window.requestAnimationFrame(loop);
	}
}

// Callback to update the canvas size
function update_canvas_size() {
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
