let objects = []; // Array of game objects
let running = true; // If false stops the loops
let frame = 0; // Number of the current frame
let player; // Player game object

let dt = 1;	// delta of time between each steps

// Initialize the game
function init()
{
	// Spawns the fighters
	for (let i = 0; i < 0; i++) {
		objects.push(new Fighter());
	}
	
	player = new Fighter();
	player.controller = new PlayerController(player);
	objects.push(player);
}

// User input handeling
document.addEventListener('keydown', (e) => {
	player.controller.input(e.code, true);
});

document.addEventListener('keyup', (e) => {
	player.controller.input(e.code, false);
});

// Draw the new frame
function draw()
{
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

	// running = false;
}

// Simulate a step
function simulate()
{
	// Simulate the objects
	objects.forEach(object => {
		object._simulate(dt);
	});

	// console.log(frame);
	frame++;
}
