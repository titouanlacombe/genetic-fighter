let objects; // Objects in the simulation
let players = [];
let winner;

let sim_dt = 0; // Delta time between last 2 sim steps
let sim_time = 0; // Time since the start of the simulation
let fixed_dt = 0.3; // fix delta time to a constant (debug tool)

function player_factory(x, y, color, controller) {
	let player = new Fighter(x, y, color, controller);

	// User input linking
	document.addEventListener('keydown', (e) => {
		controller.input(e.code, true);
	});
	document.addEventListener('keyup', (e) => {
		controller.input(e.code, false);
	});

	return player;
}

// Initialize game
function initing() {
	objects = []; // Array of game objects

	// Spawns AIs
	for (let i = 0; i < 1; i++) {
		let f = new Fighter();
		f.controller = new AIController();
		objects.push(f);
	}

	// Spawns Players
	objects.push(player_factory(100, height / 2, Color.fromHex("#9a39a3"), new Player1Controller()));
	// objects.push(player_factory(width - 100, height / 2, Color.fromHex("#4287f5"), new Player2Controller()));
}

// Draw new frame
function draw() {
	// Clear canvas
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);

	// Draw objects
	for (const object of objects) {
		object._draw();
	}
}

// Simulate a step
function simulate() {
	if (fixed_dt) {
		sim_dt = fixed_dt;
	}
	else {
		sim_dt = dt * 1 / 16; // Correction so that sim_dt is close to 1 on 60 fps
	}

	sim_time += sim_dt;

	// Move the objects
	for (const object of objects) {
		object.euler();
	}

	CollisionManager.update_distances_cache(objects);

	// Handle collisions & out of bounds
	CollisionManager.object_to_bounds(objects, 0, width, 0, height, true);
	CollisionManager.object_to_object(objects);

	// Simulate the objects
	for (const object of objects) {
		object.simulate();
	}

	// Keep alive objects
	let alive = [];
	for (const object of objects) {
		if (object.alive) {
			alive.push(object);
		}
		else {
			object.die();
		}
	}
	objects = alive;

	winner = get_winner();
	if (winner != null || objects.length == 0) {
		exiting();
		exit();
	}
}

function get_winner() {
	let is_last_fighter = objects.length == 1 && objects[0] instanceof Fighter;

	if (is_last_fighter) {
		return objects[0];
	}
	else {
		return null;
	}
}

function exiting() {
	draw();

	if (winner) {
		console.log("Winner: ", winner);
	}
	else {
		console.log("No winner");
	}
}

// Key shortcuts
// Reseting the sim
document.addEventListener('keydown', (e) => {
	if (e.code == "KeyR") {
		exit();
		init();
	}
});