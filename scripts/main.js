// Private
let last_request_id; // Last request of requestAnimationFrame
let running; // If false stops the loops

// Public
let width, height; // Dimentions of the canvas
let frames = 0; // Number of the current frame
let time = 0; // Time since the start
let real_dt = 0; // Delta time between last 2 frames
let sim_dt = 0; // Delta time between last 2 sim steps
let ctx; // 2D drawing context
let fixed_dt = 1; // fix delta time to a constant (debug tool)
let average_fps = 0;

// Init and launch the loop
function init() {
	running = true;
	update_canvas_size();
	initing();
	last_request_id = window.requestAnimationFrame(loop);
}

function fps() {
	return 1000 / real_dt;
}

function loop(new_time) {
	real_dt = (new_time - time);
	// console.log("fps: ", fps());
	time = new_time;

	sim_dt = real_dt * 1 / 16; // Correction so that sim_dt is close to 1 on 60 fps
	if (fixed_dt) sim_dt = fixed_dt;

	let canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	draw();
	simulate();

	frames++;
	average_fps += (fps() - average_fps) / frames;
	// console.log(frames);

	if (running) {
		last_request_id = window.requestAnimationFrame(loop); // Comment to stop at frame 1 (debug tool)
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
	width = canvas.width = canvas.parentElement.offsetWidth;
	height = canvas.height = canvas.parentElement.offsetHeight;
	// console.log(width, height);
}

window.addEventListener('resize', update_canvas_size);

// Wait for the window to be fully loaded before launching the game
last_request_id = window.requestAnimationFrame(init);
