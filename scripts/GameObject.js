// Abstract class GameObject
class GameObject
{
	constructor()
	{
		this.pos = new Vector2();
		this.vel = new Vector2();
		this.frc = new Vector2();

		this.angle = 0;
		this.rotation = 0;
		this.torque = 0;

		this.radius = 0;
		this.alive = true;
	}

	dist_to(object)
	{
		return this.pos.clone().sub(object.pos).norm();
	}

	simulate()
	{
		// Empty
	}

	_draw(renderer)
	{
		// Setting transforms to object state
		renderer.translate(this.pos.x(), this.pos.y());
		renderer.rotate(this.angle);

		// Drawing object
		this.draw(renderer);

		// Reseting renderer transformations by restoring saved state
		renderer.resetTransform();
	}

	draw()
	{
		// Empty
	}

	// Apply euler integration to the object properties
	euler()
	{
		// Translation
		this.vel.add(this.frc.mul(framework.app.sim_dt));
		this.pos.add(this.vel.clone().mul(framework.app.sim_dt));
		this.frc.set();

		// Rotation
		this.rotation += this.torque * framework.app.sim_dt;
		this.angle += this.rotation * framework.app.sim_dt;
		this.torque = 0;
	}

	collision(object)
	{
		// Empty
	}

	out_of_bound()
	{
		// Empty
	}

	die()
	{
		// Empty
	}
}