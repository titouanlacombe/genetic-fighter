// Class Fighter, game object, main player
class Fighter extends GameObject
{
	static fire_vel = 5;
	static vel_friction = 0.05;
	static rotvel_friction = 0.1;
	static rot_command_authority = 0.01;
	static thrust_command_authority = 0.20;
	static fuel_consumption = 0.2;

	constructor()
	{
		super();

		this.pos.set(300, 150);
		this.vel.set(0, 0);

		this.color = "white";

		this.controller = null;

		this.fuel = 100;
		this.life = 100;
		this.munitions = 100;

		this.radius = 7;
	}

	// Draw the object
	draw(ctx)
	{
		// Draw the body
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();

		// Draw the cannon
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -2 * this.radius);
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 3;
		ctx.stroke();
	}

	// Simulate the object
	simulate(dt, objects)
	{
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
				&& dist(object.pos, this.pos).norm() < object.radius + this.radius)
			{
				if (object instanceof Bullet) {
					this.life -= 10;
					// Destroy the bullet
					// object.alive = false;
				}
				else {
					this.life = 0;
				}
			}
		});

		// dies if life < 0
		if (this.life <= 0) {
			this.color = "red";
			// this.alive = false;
		}
	}

	wall_collide()
	{
		// Reset vel
		this.vel.set();
		this.life -= 50;
	}

	// Functions for controller
	// Apply thrust controll force
	command_thrust(level, dt)
	{
		if (this.fuel <= 0) {
			return;
		}

		// Anti cheat
		if (level < 0) { level = 0; }
		if (level > 1) { level = 1; }

		let thrustForce = new Vector2(0, -level * Fighter.thrust_command_authority);
		thrustForce.rotate(this.rot);
		this.frc.add(thrustForce);

		// this.fuel -= level * Fighter.fuel_consumption * dt;
	}

	// Apply rotation controll force
	command_rotation(level)
	{
		// Anti cheat
		if (level < -1) { level = -1; }
		if (level > 1) { level = 1; }

		this.rotfrc = level * Fighter.rot_command_authority;
	}

	// Spawn a bullet
	fire(objects)
	{
		if (this.munitions <= 0) {
			return;
		}
		
		// 	this.munitions--;
		let bullet = new Bullet(this.pos, this.vel);

		// Added position
		let added_pos = new Vector2(0, -2 * this.radius);
		added_pos.rotate(this.rot);
		bullet.pos.add(added_pos);

		// Added velocity
		let added_vel = new Vector2(0, -Fighter.fire_vel);
		added_vel.rotate(this.rot);
		bullet.vel.add(added_vel);

		objects.push(bullet);
	}
}
