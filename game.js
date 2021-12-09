// Initialize the game
function init() {
	let objects = []; // Array of game objects

	// Spawns the fighters
	for (let i = 0; i < 0; i++) {
		objects.push(new Fighter());
	}

	let player = new Fighter();
	player.color = "#9a39a3";
	player.controller = new PlayerController(player);
	objects.push(player);

	// User input handeling
	document.addEventListener('keydown', (e) => {
		player.controller.input(e.code, true);
	});

	document.addEventListener('keyup', (e) => {
		player.controller.input(e.code, false);
	});

	return objects;
}

// Draw the new frame
function draw(objects) {
	// Retrieve the drawing context
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	// Clear the canvas
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);

	// Draw the objects
	objects.forEach(object => {
		object._draw(ctx);
	});

	ctx.restore();
	running = false; // Stop at frame 1 (debug tool)
}

// Simulate a step
function simulate(dt, objects) {
	// console.log(objects);
	// Simulate the objects
	objects.forEach(object => {
		object._simulate(dt, objects);
	});

	// Remove objects when dead
	objects.forEach((object, index, array) => {
		if (!object.alive) {
			array.splice(index, 1);
		}
	});
}
