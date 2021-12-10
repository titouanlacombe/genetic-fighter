// Private
let last_request_id; // Last request of requestAnimationFrame
let running; // If false stops the loops

// Public
let width, height; // Dimentions of the canvas
let frames = 0; // Number of the current frame
let time = 0; // Time since the start
let dt = 0; // Delta time between last frames
let ctx; // 2D drawing context

// Init and launch the loop
function init() {
	running = true;
	update_canvas_size();
	initing();
	last_request_id = window.requestAnimationFrame(loop);
}

// Retrieve the canvas drawing context
function get_context() {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');
	ctx.save();
	return ctx;
}

function fps() {
	return 1000 / dt;
}

function loop(new_time) {
	dt = (new_time - time);
	// console.log("fps: ", fps());
	time = new_time;

	dt *= 1 / 128; // Correction so that dt is close to 1 on 60 fps
	// dt = 1; // fix delta time to a constant (debug tool)

	ctx = get_context();
	draw();
	simulate();

	frames++;
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
