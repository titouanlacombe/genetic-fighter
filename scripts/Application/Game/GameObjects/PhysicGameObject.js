/**
 */
class PhysicGameObject extends GameObjectInterface {
	/**
	 * @constructor
	 */
	constructor() {
		super();

		this.pos = new Vector2();
		this.vel = new Vector2();
		this.frc = new Vector2();

		this.angle = 0;
		this.rotation = 0;
		this.torque = 0;

		this.radius = 0;
	}

	/**
	 * Tells the renderer to go to the objects position & rotation before drawing
	 * @param {Renderer} renderer 
	 */
	draw(renderer) {
		// Setting transforms to object state
		renderer.translate(this.pos.x(), this.pos.y());
		renderer.rotate(this.angle);

		// Drawing object
		this._draw(renderer);

		// Reseting renderer transformations by restoring saved state
		renderer.resetTransform();
	}

	/**
	 * Return the distance from this to object
	 * @param {GameObject} object 
	 * @returns {Number}
	 */
	dist_to(object) {
		return this.pos.clone().sub(object.pos).norm();
	}

	/**
	 * Move the object according to Euler inegration
	 * @param {Number} dt delta time between steps 
	 */
	euler(dt) {
		// Translation
		this.vel.add(this.frc.mul(dt));
		this.pos.add(this.vel.clone().mul(dt));
		this.frc.set();

		// Rotation
		this.rotation += this.torque * dt;
		this.angle += this.rotation * dt;
		this.torque = 0;
	}

	/**
	 * Called if object enters in collision with annother
	 * @param {GameObject} object Collided with
	 */
	collision(object) {
		// Empty
	}

	/**
	 * Called if object exit sim boundaries
	 */
	out_of_bound() {
		// Empty
	}
}