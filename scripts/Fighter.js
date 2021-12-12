// Class Fighter, game object, main player
class Fighter extends GameObject {
	static friction = 0.05;
	static rot_friction = 0.1;

	static size = 5;
	static lineWidth = Fighter.size / 2.5;

	static rot_command_authority = 0.01;
	static thrust_command_authority = 0.20;

	static fuel_consumption = 0.1;
	static fire_vel = 10;
	static cannon_fire_cooldown = 4;

	static max_fuel = 100;
	static max_life = 100;
	static max_munitions = 300;

	constructor(x, y, color = Color.white, controller = null) {
		super();

		// Generate random position if no provided
		if (!x) {
			x = Math.random() * width;
		}
		if (!y) {
			y = Math.random() * height;
		}

		this.pos.set(x, y);
		this.vel.set();

		this.rot = Math.random() * 2 * Math.PI;

		this.controller = controller;

		this.color = color;

		this.fuel = Fighter.max_fuel;
		this.life = Fighter.max_life;
		this.munitions = Fighter.max_munitions;

		this.radius = Fighter.size;
		this.cannon_cooldown = 0;
	}

	draw_thruster(sign) {
		ctx.beginPath();
		ctx.moveTo(sign * this.radius * 0.8, 0);
		ctx.lineTo(sign * this.radius * 0.8, this.radius * 1.3);
		ctx.stroke();
	}

	get_color(value, min, max) {
		return Color.lerp(this.color, Color.red, map_value(value, min, max)).toString();
	}

	// Draw the object
	draw() {
		ctx.lineWidth = Fighter.lineWidth;

		// Draw the cannon
		ctx.strokeStyle = this.get_color(this.munitions, 0, Fighter.max_munitions);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -2 * this.radius);
		ctx.stroke();

		// Draw thrusters
		ctx.strokeStyle = this.get_color(this.fuel, 0, Fighter.max_fuel);
		this.draw_thruster(1);
		this.draw_thruster(-1);

		// Draw the body
		ctx.fillStyle = this.get_color(this.life, 0, Fighter.max_life);
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	}

	// Simulate the object
	simulate() {
		// Controller
		if (this.controller) {
			let command = this.controller.control(this);
			this.command_rotation(command.rotation ?? 0);
			this.command_thrust(command.thrust ?? 0);
			this.command_fire(command.fire ?? false);
		}

		// Cannon cooldown
		this.cannon_cooldown -= sim_dt;

		// Vel friction
		this.frc.add(this.vel.clone().mul(-Fighter.friction));

		// Rotate friction
		this.rotfrc += this.rotvel * -Fighter.rot_friction;

		// dies if life < 0
		if (this.life <= 0) {
			this.alive = false;
		}
	}

	out_of_bound(reason) {
		this.vel.set(); // Reset vel
		this.life -= 50;

		if (reason == "min_x") {
			this.pos.x = this.radius;
		} else if (reason == "max_x") {
			this.pos.x = width - this.radius;
		} else if (reason == "min_y") {
			this.pos.y = this.radius;
		} else if (reason == "max_y") {
			this.pos.y = height - this.radius;
		}
	}

	command_validator(value, min, max) {
		if (isNaN(value)) {
			console.log("value NaN");
			return 0;
		}

		// Anti cheat
		if (value < min) {
			value = min;
		}
		if (value > max) {
			value = max;
		}

		return value;
	}

	// Functions for controller
	// Apply thrust controll force
	command_thrust(throttle) {
		if (this.fuel <= 0) {
			return;
		}
		
		throttle = this.command_validator(throttle, 0, 1);
		this.fuel -= throttle * Fighter.fuel_consumption * sim_dt;

		let thrustForce = new Vector2(0, -throttle * Fighter.thrust_command_authority);
		thrustForce.rotate(this.rot);
		this.frc.add(thrustForce);
	}

	// Apply rotation controll force
	command_rotation(throttle) {
		throttle = this.command_validator(throttle, -1, 1);
		this.rotfrc = throttle * Fighter.rot_command_authority;
	}

	// Spawn a bullet
	// Return if success
	command_fire(bool) {
		if (!bool) {
			return;
		}

		// Munition or cannon not recharged
		if (this.munitions <= 0 || this.cannon_cooldown > 0) {
			return false;
		}

		this.munitions--;
		this.cannon_cooldown = Fighter.cannon_fire_cooldown; // reset cooldown

		// Create new bullet
		let bullet = new Bullet(this.pos, this.vel, this.r);
		// Add cannon position
		let added_pos = new Vector2(0, -2.1 * this.radius);
		added_pos.rotate(this.rot);
		bullet.pos.add(added_pos);
		// Add my velocity
		let added_vel = new Vector2(0, -Fighter.fire_vel);
		added_vel.rotate(this.rot);
		bullet.vel.add(added_vel);
		// Add to objects
		objects.push(bullet);

		return true;
	}

	collision(object) {
		if (object instanceof Bullet) {
			this.life -= 20;
			object.alive = false; // Destroy the bullet
		} else if (object instanceof Fighter) {
			this.life -= 100;
		}
	}

	die() {
		if (this.controller instanceof Player1Controller) {
			console.log("Player 1 died");
		} else if (this.controller instanceof Player2Controller) {
			console.log("Player 2 died");
		}
	}
}