// Private
let last_request_id; // Last request of requestAnimationFrame
let running; // If false stops the loops

// Public
let width, height; // Dimentions of the canvas
let frames = 0; // Number of frames displayed since the start
let time = 0; // Time since the start
let dt = 0; // Delta time between last 2 frames
let average_fps = 0;
let ctx; // 2D drawing context

// Init and launch the loop
function init() {
	running = true;
	update_canvas_size();
	initing();
	last_request_id = window.requestAnimationFrame(loop);
}

function fps() {
	return 1000 / dt;
}

function loop(new_time) {
	dt = (new_time - time);
	time = new_time;
	
	let canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	simulate();
	draw();
	
	frames++;
	average_fps += (fps() - average_fps) / frames;

	// console.log("fps: ", fps());
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
