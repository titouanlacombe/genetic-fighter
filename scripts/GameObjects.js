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

	_simulate() {
		this.euler();
		this.simulate();
	}

	simulate() {
		// Empty
	}

	// Translate & rotate to the object
	apply_transform_ctx() {
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.rot);
	}

	_draw() {
		ctx.save();
		this.apply_transform_ctx();
		this.draw();
		ctx.restore(); // reseting ctx transformations by restoring saved state
	}

	draw() {
		// Empty
	}

	// Apply euler integration to the object properties
	euler() {
		// Translation
		this.vel.add(this.frc.mul(dt));
		this.pos.add(this.vel.clone().mul(dt));
		this.frc.set();

		// Rotation
		this.rotvel += this.rotfrc * dt;
		this.rot += this.rotvel * dt;
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