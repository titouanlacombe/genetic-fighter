/**
 * GameObject
 * Handle basic simulation & drawing
 * @abstract
 */
class GameObject
{
	/**
	 * @constructor
	 */
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

	/**
	 * Return the distance from this to object
	 * @param {GameObject} object 
	 * @returns {Number}
	 */
	dist_to(object)
	{
		return this.pos.clone().sub(object.pos).norm();
	}

	/**
	 * Simulate the object
	 */
	simulate()
	{
		// Empty
	}

	/**
	 * Tells the renderer to go to the objects position & rotation before drawing
	 * @param {Renderer} renderer 
	 */
	draw_wrapper(renderer)
	{
		// Setting transforms to object state
		renderer.translate(this.pos.x(), this.pos.y());
		renderer.rotate(this.angle);

		// Drawing object
		this.draw(renderer);

		// Reseting renderer transformations by restoring saved state
		renderer.resetTransform();
	}

	/**
	 * Draw the object
	 */
	draw()
	{
		// Empty
	}

	/**
	 * Move the object according to Euler inegration
	 */
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

	/**
	 * Called if object enters in collision with annother
	 * @param {GameObject} object Collided with
	 */
	collision(object)
	{
		// Empty
	}

	/**
	 * Called if object exit sim boundaries
	 */
	out_of_bound()
	{
		// Empty
	}

	/**
	 * Called when object is removed from objects list
	 */
	die()
	{
		// Empty
	}
}