let fighterSize = 7;

// Class Fighter, game object, main player
class Fighter extends GameObject
{
	constructor()
	{
		super();

		this.pos.set(50, 50);
		this.vel.set(1, 0);
		this.rot = 0;

		this.color = "white";
	}

	// Draw the object
	draw(ctx)
	{
		// Draw the body
		ctx.beginPath();
		ctx.arc(0, 0, fighterSize, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();

		// Draw the cannon
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -2 * fighterSize);
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 3;
		ctx.stroke();
	}
	
	// Simulate the object
	simulate(dt)
	{
	}
}
