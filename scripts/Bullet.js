/**
 * Bullet fired by Fighter cannon
 * Simple object, only force applied to it is friction
 * 
 * @extends GameObject
 */
class Bullet extends GameObject {
	/**
	 * Specify the amount of air friction applied to the bullet
	 * @static
	 */
	static friction = 0.005;

	/**
	 * @param {Vector2} pos starting position
	 * @param {Vector2} vel starting velocity
	 */
	constructor(pos, vel) {
		super();

		this.pos.setv(pos);
		this.vel.setv(vel);

		this.radius = Fighter.lineWidth / 2;
	}

	/**
	 * Draw the bullet
	 * @param {Renderer} renderer 
	 */
	draw(renderer) {
		renderer.beginPath();
		renderer.arc(0, 0, this.radius, 0, 2 * Math.PI);
		renderer.fillStyle = "white";
		renderer.fill();
	}

	/**
	 * Simulate the bullet
	 * Apply forces & Kill if no life left
	 * @param {Array} objects array of GameObjects
	 * @param {Number} dt delta time between steps 
	 */
	simulate(objects, dt) {
		// Vel friction
		this.frc.add(this.vel.clone().mul(-Bullet.friction));

		// Kill if vel to low
		if (this.vel.norm() < 1) {
			this.alive = false;
		}
	}

	/**
	 * If bullet collide with something it becomes dead
	 */
	collision(object) {
		if (object instanceof Bullet) {
			// les Bullets s'annulent
			this.alive = false;
		}
	}

	/**
	 * If bullet leave the simulation area, kills it
	 * @param {String} reason ID of the crossed bound
	 */
	out_of_bound(reason) {
		this.alive = false;
	}
}