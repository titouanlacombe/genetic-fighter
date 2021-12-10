let width, height; // Dimentions of the canvas
let global_objects; // State of the simulation
let running = true; // If false stops the loops
let last_request_id; // Last request of requestAnimationFrame
let frames = 0; // Number of the current frame
let time = 0;

// Init and launch the loop
function init() {
	running = true;
	update_canvas_size();
	global_objects = initing();
	last_request_id = window.requestAnimationFrame(loop);
}

// Retrieve the drawing context
function get_context() {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');
	ctx.save();
	return ctx;
}

function loop(new_time) {
	let dt = (new_time - time);
	time = new_time;
	
	// console.log("fps: ", 1000 / dt);

	dt *= 1 / 128; // Correction so that dt is close to 1 on 60 fps
	// dt = 1; // fix delta time to a constant (debug tool)

	draw(global_objects);
	simulate(dt, global_objects);

	frames++;
	// console.log(frames);

	if (running) {
		last_request_id = window.requestAnimationFrame(loop); // Comment to stop at frame 1 (debug tool)
	}
	else {
		exiting();
	}
}

function exit() {
	window.cancelAnimationFrame(last_request_id);
	running = false;
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
last_request_id = window.requestAnimationFrame(init);
