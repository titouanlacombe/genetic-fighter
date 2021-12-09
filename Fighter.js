// Class Fighter, game object, main player
class Fighter extends GameObject {
	static fire_vel = 5;
	static vel_friction = 0.05;
	static rotvel_friction = 0.1;
	static rot_command_authority = 0.01;
	static thrust_command_authority = 0.20;
	static fuel_consumption = 0.2;
	static cannon_fire_cooldown = 4;

	constructor(x, y) {
		super();

		if (!x) { x = Math.random() * width; }
		if (!y) { y = Math.random() * height; }

		this.color = "#FFF";
		this.canon_color = this.color;
		this.thrusters_color = this.color;
		this.body_color = this.color;

		this.pos.set(x, y);
		this.vel.set();
		
		this.max_fuel = 100;
		this.max_life = 100;
		this.max_munitions = 100;
		
		this.fuel = this.max_fuel;
		this.life = this.max_life;
		this.munitions = this.max_munitions;

    this.controller = null;
		this.radius = 7;
		this.cannon_cooldown = 0;
	}

	// Draw the object
	draw(ctx) {
		// Draw the cannon
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -2 * this.radius);
		ctx.strokeStyle = this.canon_color;
		ctx.lineWidth = this.radius / 3;
		ctx.stroke();

		// Draw thrusters
		ctx.beginPath();
		ctx.moveTo(this.radius * 0.8, 0);
		ctx.lineTo(this.radius, 1.2 * this.radius);
		ctx.strokeStyle = this.thrusters_color;
		ctx.lineWidth = this.radius / 3;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(-this.radius * 0.8, 0);
		ctx.lineTo(-this.radius, 1.2 * this.radius);
		ctx.strokeStyle = this.thrusters_color;
		ctx.lineWidth = this.radius / 3;
		ctx.stroke();

		// Draw the body
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.body_color;
		ctx.fill();
	}

	// Simulate the object
	simulate(dt, objects) {
		if (this.controller) { this.controller.control(this, dt, objects); }

		// Vel friction
		this.frc.add(this.vel.clone().mul(-Fighter.vel_friction));

		// Rotate friction
		this.rotfrc += this.rotvel * -Fighter.rotvel_friction;

		// Wall Collisions
		if (this.pos.x < 0) {
			this.pos.x = 0;
			this.wall_collide();
		}
		else if (this.pos.x > width) {
			this.pos.x = width;
			this.wall_collide();
		}
		if (this.pos.y < 0) {
			this.pos.y = 0;
			this.wall_collide();
		}
		else if (this.pos.y > height) {
			this.pos.y = height;
			this.wall_collide();
		}

		// Objects Collisions
		objects.forEach(object => {
			if (object != this
				&& dist(object.pos, this.pos).norm() < object.radius + this.radius) {
				if (object instanceof Bullet) {
					this.life -= 10;
					this.body_color = merge_colors("#FF0000", this.body_color, 10);

					// Destroy the bullet
					object.alive = false;
				}
				else {
					this.life = 0;
				}
			}
		});

		// dies if life < 0
		if (this.life <= 0) {
			this.body_color = "#FF0000";
			this.alive = false;
		}
	}

	// TODO integrate into collision
	wall_collide() {
		// Reset vel
		this.vel.set();
		this.life -= 50;
	}

	// Functions for controller
	// Apply thrust controll force
	command_thrust(level, dt) {
		if (this.fuel <= 0) {
			return;
		}

		if (isNaN(level)) {
			console.log("thrust level NaN");
			return;
		}

		// Anti cheat
		if (level < 0) { level = 0; }
		if (level > 1) { level = 1; }

		let thrustForce = new Vector2(0, -level * Fighter.thrust_command_authority);
		thrustForce.rotate(this.rot);
		this.frc.add(thrustForce);

		this.fuel -= level * Fighter.fuel_consumption * dt;
		this.thrusters_color = merge_colors("#FF0000", this.thrusters_color, level * Fighter.fuel_consumption * dt * 5);
	}

	// Apply rotation controll force
	command_rotation(level) {
		if (isNaN(level)) {
			console.log("rotation level NaN");
			return;
		}

		// Anti cheat
		if (level < -1) { level = -1; }
		if (level > 1) { level = 1; }

		this.rotfrc = level * Fighter.rot_command_authority;
	}

	// Spawn a bullet
	// Return success
	fire(dt, objects) {
		if (this.munitions <= 0) {
			return false;
		}
		
		// Cannon cooldown
		if (this.cannon_cooldown > 0) {
			this.cannon_cooldown -= dt;
			return false;
		}

		this.munitions--;
		this.canon_color = merge_colors("#FF0000", this.canon_color, 2);
		// reset cooldown
		this.cannon_cooldown = Fighter.cannon_fire_cooldown;

		let bullet = new Bullet(this.pos, this.vel);

		// Added position
		let added_pos = new Vector2(0, -3 * this.radius);
		added_pos.rotate(this.rot);
		bullet.pos.add(added_pos);

		// Added velocity
		let added_vel = new Vector2(0, -Fighter.fire_vel);
		added_vel.rotate(this.rot);
		bullet.vel.add(added_vel);

		objects.push(bullet);

		return true;
	}

	collision(object)
	{
		if (object instanceof Bullet) {
			this.life -= 10;
			object.alive = false; // Destroy the bullet
		}
		else {
			this.life -= 100;
		}
	}

	die()
	{
		if (this.controller instanceof Player1Controller) {
			console.log("Player 1 died");
		}
		else if (this.controller instanceof Player2Controller) {
			console.log("Player 2 died");
		}
	}
}
