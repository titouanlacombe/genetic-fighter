let objects = [];
let running = true;
let frame = 0;

let dt = 1;

function init()
{
	for (let i = 0; i < 10; i++) {
		objects.push(new Fighter());
	}
}

function draw()
{
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);

	objects.forEach(object => {
		object.draw(ctx);
	});

	running = false;
}

function simulate()
{
	objects.forEach(object => {
		object.simulate(dt);
	});

	console.log(frame);
	frame++;
}
