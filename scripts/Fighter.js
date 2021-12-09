// Class Fighter, game object, main player
class Fighter extends GameObject {
	static friction = 0.05;
	static rot_friction = 0.1;
	
	static rot_command_authority = 0.01;
	static thrust_command_authority = 0.20;
	
	static fuel_consumption = 0.2;
	static fire_vel = 5;
	static cannon_fire_cooldown = 4;
	
	static max_fuel = 100;
	static max_life = 100;
	static max_munitions = 100;

	constructor(x, y, color = Color.white, controller = null) {
		super();

		// Generate random position if no provided
		if (!x) { x = Math.random() * width; }
		if (!y) { y = Math.random() * height; }

		this.pos.set(x, y);
		this.vel.set();
		
    	this.controller = controller;
		
		this.color = color;
		
		this.fuel = Fighter.max_fuel;
		this.life = Fighter.max_life;
		this.munitions = Fighter.max_munitions;

		this.radius = 7;
		this.cannon_cooldown = 0;
	}

	draw_thruster(ctx, sign) {
		ctx.moveTo(sign * this.radius * 0.8, 0);
		ctx.lineTo(sign * this.radius, 1.2 * this.radius);
		ctx.strokeStyle = this.thrusters_color;
		ctx.lineWidth = this.radius / 3;
		ctx.stroke();
	}

	get_color(value, min, max) {
		return Color.lerp(this.color, Color.red, map_value(value, min, max)).toString();
	}

	// Draw the object
	draw(ctx) {
		// Draw the cannon
		ctx.strokeStyle = this.get_color(this.munitions, 0, Fighter.max_munitions);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -2.4 * this.radius);
		ctx.lineWidth = this.radius / 3;
		ctx.stroke();

		// Draw thrusters
		ctx.strokeStyle = this.get_color(this.fuel, 0, Fighter.max_fuel);
		this.draw_thruster(ctx, 1);
		this.draw_thruster(ctx, -1);

		// Draw the body
		ctx.fillStyle = this.get_color(this.life, 0, Fighter.max_life);
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.body_color;
		ctx.fill();
	}

	// Simulate the object
	simulate(dt, objects) {
		// Controller
		if (this.controller) { this.controller.control(this, dt, objects); }
		
		// Cannon cooldown
		this.cannon_cooldown -= dt;
		
		// Vel friction
		this.frc.add(this.vel.clone().mul(-Fighter.friction));

		// Rotate friction
		this.rotfrc += this.rotvel * -Fighter.rot_friction;

		// Wall Collisions
		// TODO integrate into collision
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

		// dies if life < 0
		if (this.life <= 0) {
			this.alive = false;
		}
	}

	wall_collide() {
		this.vel.set(); // Reset vel
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
		
		this.fuel -= level * Fighter.fuel_consumption * dt;

		let thrustForce = new Vector2(0, -level * Fighter.thrust_command_authority);
		thrustForce.rotate(this.rot);
		this.frc.add(thrustForce);
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
	// Return if success
	fire(dt, objects) {
		// Munition or cannon not recharged
		if (this.munitions <= 0 || this.cannon_cooldown > 0) {
			return false;
		}

		this.munitions--;
		this.cannon_cooldown = Fighter.cannon_fire_cooldown; // reset cooldown

		// Create new bullet
		let bullet = new Bullet(this.pos, this.vel);
		// Add cannon position
		let added_pos = new Vector2(0, -2.5 * this.radius);
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

	collision(object)
	{
		if (object instanceof Bullet) {
			this.life -= 10;
			object.alive = false; // Destroy the bullet
		}
		else if (object instanceof Fighter) {
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
