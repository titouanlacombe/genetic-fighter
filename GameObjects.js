// Abstract class GameObject
class GameObject
{
	constructor()
	{
		this.pos = new Vector2();
		this.vel = new Vector2();
		this.frc = new Vector2();

		this.rot = 0;
		this.rotvel = 0;
		this.rotfrc = 0;
	}
	
	_simulate(dt)
	{
		this.euler(dt);
		this.simulate();
	}
	
	simulate()
	{
		abstractError();
	}
	
	_draw(ctx)
	{
		ctx.save();

		// Translate & rotate to the object
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.rot);

		this.draw(ctx);

		// reset ctx transformations
		ctx.restore();
	}

	draw(ctx)
	{
		abstractError();
	}

	// Apply euler integration to the object properties
	euler(dt)
	{
		// Translation
		this.vel.add(this.frc.mul(dt));
		this.pos.add(this.vel.clone().mul(dt));
		this.frc.set();

		// Rotation
		this.rotvel += this.rotfrc * dt;
		this.rot += this.rotvel * dt;
		this.rotfrc = 0;
	}
}
