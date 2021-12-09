let players = [];

function player_factory(x, y, color, controller)
{
	let player = new Fighter(x, y);
	player.color = color;
	player.controller = controller;

	// User input handeling
	document.addEventListener('keydown', (e) => {
		controller.input(e.code, true);
	});

	document.addEventListener('keyup', (e) => {
		controller.input(e.code, false);
	});

	return player;
}

// Initialize the game
function init() {
	let objects = []; // Array of game objects

	// Spawns the AIs
	for (let i = 0; i < 500; i++) {
		let f = new Fighter();
		f.controller = new AIController();
		objects.push(f);
	}
	
	// Spawns the Players
	// objects.push(player_factory(100, height / 2, "#9a39a3", new Player1Controller()));
	// objects.push(player_factory(width - 100, height / 2, "#4287f5", new Player2Controller()));

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
}

// Simulate a step
function simulate(dt, objects) {
	// Simulate the objects
	objects.forEach(object => {
		object._simulate(dt, objects);
	});

	CollisionManager.check_collisions(objects);

	// Remove objects when dead
	objects.forEach((object, index, array) => {
		if (!object.alive) {
			array.splice(index, 1);
		}
	});
}
