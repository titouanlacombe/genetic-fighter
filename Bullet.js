// Bullet
class Bullet extends GameObject
{
    constructor(x, y)
    {
        super();

        this.pos = set(x, y);
    }

	// Draw the object
	draw(ctx)
	{
		// Draw the body
		ctx.beginPath();
		ctx.arc(0, 0, fighterSize, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
	
	// Simulate the object
	simulate(dt)
	{
	}
}
