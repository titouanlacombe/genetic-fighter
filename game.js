// Initialize the game
function init() {
	let objects = []; // Array of game objects

	// Spawns the fighters
	for (let i = 0; i < 0; i++) {
		objects.push(new Fighter());
	}

	let player1 = new Fighter(100, 200);
	player1.color = "#9a39a3";
	player1.controller = new PlayerController();
	objects.push(player1);

	let player2 = new Fighter(200, 100);
	player2.color = "#fff";
	player2.controller = new Player2Controller();
	objects.push(player2);

	// User input handeling

	document.addEventListener('keydown', (e) => {
		player1.controller.input(e.code, true);
		player2.controller.input(e.code, true);
	});

	document.addEventListener('keyup', (e) => {
		player1.controller.input(e.code, false);
		player2.controller.input(e.code, false);
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
