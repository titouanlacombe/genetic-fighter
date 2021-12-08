// Error when abstract class function is not implemented
function abstractError()
{
	throw new Error("You must implement this function: " + arguments.callee);
}

// Abstract class GameObject
class GameObject
{
	constructor()
	{
		this.pos = new Vector2();
		this.vel = new Vector2();
		this.frc = new Vector2();
	}
	
	_simulate(dt)
	{
		this.euler(dt);
		this.simulate(dt);
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
		this.vel.add(this.frc.mul(dt));
		this.pos.add(this.vel.clone().mul(dt));
		
		this.frc.set();
	}
}
