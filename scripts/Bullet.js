// Bullet
class Bullet extends GameObject {
	static friction = 0.005;

	constructor(pos, vel) {
		super();

		this.pos.set_v(pos);
		this.vel.set_v(vel);

		this.radius = Fighter.lineWidth / 2;
	}

	// Draw the object
	draw(ctx) {
		// Draw the body
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = "white";
		ctx.fill();
	}

	// Simulate the object
	simulate(dt, objects) {
		// Vel friction
		this.frc.add(this.vel.clone().mul(-Bullet.friction));

		// Kill if vel to low
		if (this.vel.norm() < 1) {
			this.alive = false;
		}
	}

	collision(object) {
		if (object instanceof Bullet) {
			// les Bullets s'annulent
			this.alive = false;
		}
	}

	out_of_bound(reason) {
		this.alive = false;
	}
}