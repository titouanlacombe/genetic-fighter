// Abstract class GameObject
class GameObject {
	constructor() {
		this.pos = new Vector2();
		this.vel = new Vector2();
		this.frc = new Vector2();

		this.rot = 0;
		this.rotvel = 0;
		this.rotfrc = 0;

		this.radius = 0;
		this.alive = true;
	}

	dist_to(object) {
		return this.pos.clone().sub(object.pos).norm();
	}

	simulate() {
		// Empty
	}

	_draw() {
		ctx.translate(this.pos.x(), this.pos.y());
		ctx.rotate(this.rot);
		this.draw();
		ctx.resetTransform(); // reseting ctx transformations by restoring saved state
	}

	draw() {
		// Empty
	}

	// Apply euler integration to the object properties
	euler() {
		// Translation
		this.vel.add(this.frc.mul(sim_dt));
		this.pos.add(this.vel.clone().mul(sim_dt));
		this.frc.set();

		// Rotation
		this.rotvel += this.rotfrc * sim_dt;
		this.rot += this.rotvel * sim_dt;
		this.rotfrc = 0;
	}

	collision(object) {
		// Empty
	}

	out_of_bound() {
		// Empty
	}

	die() {
		// Empty
	}
}