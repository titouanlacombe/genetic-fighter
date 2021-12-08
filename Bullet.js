// Bullet
class Bullet extends GameObject
{
	static vel_friction = 0.01;
	
    constructor(pos, vel)
    {
        super();

        this.pos.setV(pos);
        this.vel.setV(vel);

		this.radius = 3;
    }

	// Draw the object
	draw(ctx)
	{
		// Draw the body
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = "white";
		ctx.fill();
	}
	
	// Simulate the object
	simulate(dt)
	{
		// Vel friction
		this.frc.add(this.vel.clone().mul(-Bullet.vel_friction));
	}
}
