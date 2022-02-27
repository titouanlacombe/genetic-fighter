/**
 * Main GameObject
 * Can thrust, fire
 * Affected by friction and controller commands
 * @extends GameObject
 */
class Fighter extends GameObject {
	/** Amount life removed by unit of time to limit game time */
	static life_loss = 0.2;

	/** Amount of air friction (& rotation) */
	static friction = 0.05;
	static rot_friction = 0.1;

	/** Size in pixels (main body) */
	static size = 5;
	static lineWidth = Fighter.size / 2.5;

	/** Amount of force that a commands can exerce */
	static rot_command_authority = 0.01;
	static thrust_command_authority = 0.20;

	/** Fuel consumed by unit of time */
	static fuel_consumption = 0.1;
	/** Initial velocity of bullets leaving the cannon */
	static fire_vel = 10;
	/** Cannon cooldown in units of time */
	static cannon_fire_cooldown = 4;

	/** Max amount of each status */
	static max_fuel = 100;
	static max_life = 100;
	static max_munitions = 300;

	/**
	 * @constructor
	 * @param {GameApplication} app Game application
	 * @param {Number} x Starting x position
	 * @param {Number} y Starting x position
	 * @param {Color} color Base color of the object
	 * @param {Controller} controller Controller of the object
	 */
	constructor(x, y, color = Color.white, controller = null) {
		super();

		// Generate random position if no provided
		if (!x) {
			x = Math.random() * framework.width;
		}
		if (!y) {
			y = Math.random() * framework.height;
		}

		this.pos.set(x, y);
		this.vel.set();

		this.angle = Math.random() * 2 * Math.PI;

		this.controller = controller;

		this.color = color;

		this.fuel = Fighter.max_fuel;
		this.life = Fighter.max_life;
		this.munitions = Fighter.max_munitions;

		this.radius = Fighter.size;
		this.cannon_cooldown = 0;
		this.time_lived = 0;
	}

	/**
	 * Draw one thruster
	 * @param {Renderer} renderer Context renderer
	 * @param {Number} sign 1 or -1 depending on the side to draw on
	 */
	draw_thruster(renderer, sign) {
		renderer.beginPath();
		renderer.moveTo(sign * this.radius * 0.8, 0);
		renderer.lineTo(sign * this.radius * 0.8, this.radius * 1.3);
		renderer.stroke();
	}

	/**
	 * Return a color between this.Color & Red depending on how low is value
	 * min & max provide context for value
	 * @param {Number} value 
	 * @param {Number} min 
	 * @param {Number} max 
	 * @returns {Color}
	 */
	get_color(value, min, max) {
		return Color.lerp(this.color, Color.red, map_value(value, min, max)).toString();
	}

	/**
	 * Draw the object
	 * @param {Renderer} renderer 
	 */
	draw(renderer) {
		renderer.lineWidth = Fighter.lineWidth;

		// Draw the cannon
		renderer.strokeStyle = this.get_color(this.munitions, 0, Fighter.max_munitions);
		renderer.beginPath();
		renderer.moveTo(0, 0);
		renderer.lineTo(0, -2 * this.radius);
		renderer.stroke();

		// Draw thrusters
		renderer.strokeStyle = this.get_color(this.fuel, 0, Fighter.max_fuel);
		this.draw_thruster(renderer, 1);
		this.draw_thruster(renderer, -1);

		// Draw the body
		renderer.fillStyle = this.get_color(this.life, 0, Fighter.max_life);
		renderer.beginPath();
		renderer.arc(0, 0, this.radius, 0, 2 * Math.PI);
		renderer.fill();
	}

	/**
	 * Simmulate the object
	 * Apply the forces
	 * @param {Array} objects array of GameObjects
	 * @param {Number} dt delta time between steps 
	 */
	simulate(objects, dt) {
		// Controller
		if (this.controller) {
			let command = this.controller.control(this, dt);
			this.command_rotation(command.rotation ?? 0);
			this.command_thrust(command.thrust ?? 0, dt);
			this.command_fire(command.fire ?? false, objects);
		}

		this.time_lived += dt;
		this.life -= Fighter.life_loss * dt;
		this.cannon_cooldown -= dt;

		// Vel friction
		this.frc.add(this.vel.clone().mul(-Fighter.friction));

		// Rotate friction
		this.torque += this.rotation * -Fighter.rot_friction;

		// dies if life < 0
		if (this.life <= 0) {
			this.alive = false;
		}
	}

	/**
	 * Called if object leave sim bounds
	 * Replace object to a valid position & reset speed
	 * @param {String} reason ID of the crossed bound
	 */
	out_of_bound(reason) {
		this.vel.set(); // Reset vel
		this.life -= 50;

		if (reason == "min_x") {
			this.pos.setx(this.radius);
		} else if (reason == "max_x") {
			this.pos.setx(framework.width - this.radius);
		} else if (reason == "min_y") {
			this.pos.sety(this.radius);
		} else if (reason == "max_y") {
			this.pos.sety(framework.height - this.radius);
		}
	}

	/**
	 * Throws warning if a value is invalid
	 * Return a valid value
	 * 
	 * @param {Number} value 
	 * @param {Number} min 
	 * @param {Number} max 
	 * @returns {Number}
	 */
	command_validator(value, min, max) {
		if (isNaN(value)) {
			throw Error("command_validator: value NaN");
		}

		// Project to valid space
		if (value < min) {
			value = min;
		}
		if (value > max) {
			value = max;
		}

		return value;
	}

	/**
	 * Execute the thrust command
	 * @param {Number} throttle 
	 * @param {Number} dt delta time between steps 
	 */
	command_thrust(throttle, dt) {
		if (this.fuel <= 0) {
			return;
		}

		throttle = this.command_validator(throttle, 0, 1);
		this.fuel -= throttle * Fighter.fuel_consumption * dt;

		let thrustForce = new Vector2(0, -throttle * Fighter.thrust_command_authority);
		thrustForce.rotate(this.angle);
		this.frc.add(thrustForce);
	}

	/**
	 * Execute the rotation command
	 * @param {Number} throttle 
	 */
	command_rotation(throttle) {
		throttle = this.command_validator(throttle, -1, 1);
		this.torque = throttle * Fighter.rot_command_authority;
	}

	/**
	 * Execute the fire command
	 * @param {Boolean} bool Only fire if this is true
	 * @param {Array} objects array of GameObjects
	 * @returns {Boolean} If success
	 */
	command_fire(bool, sim_objects) {
		if (!bool) {
			return false;
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
		added_pos.rotate(this.angle);
		bullet.pos.add(added_pos);
		// Add my velocity
		let added_vel = new Vector2(0, -Fighter.fire_vel);
		added_vel.rotate(this.angle);
		bullet.vel.add(added_vel);
		// Add to objects
		sim_objects.push(bullet);

		return true;
	}

	/**
	 * If we collide with another object:
	 * - If it's a bullet we lose a little life
	 * - If it's a fighter we lose a lot of life
	 * @param {GameObject} object 
	 */
	collision(object) {
		if (object instanceof Bullet) {
			this.life -= 20;
			object.alive = false; // Destroy the bullet
		} else if (object instanceof Fighter) {
			this.life -= 100;
		}
	}

	/**
	 * Just log a message if we are a player
	 */
	die() {
		if (this.controller instanceof Player1Controller) {
			console.log("Player 1 died");
		}
		else if (this.controller instanceof Player2Controller) {
			console.log("Player 2 died");
		}
	}
}