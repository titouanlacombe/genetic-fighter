// Bullet
class Bullet extends GameObject
{
    static bulletSize = 3;

    constructor(pos, vel)
    {
        super();

        this.pos.setV(pos);
        this.vel.setV(vel);
    }

	// Draw the object
	draw(ctx)
	{
		// Draw the body
		ctx.beginPath();
		ctx.arc(0, 0, Bullet.bulletSize, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
	
	// Simulate the object
	simulate(dt)
	{
        // Simulate drag
	}
}
