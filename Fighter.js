// Class Fighter, game object, main player
class Fighter extends GameObject
{
	static fighterSize = 7;
	static fire_vel = 5;
	static vel_friction = 0.02;
	static rotvel_friction = 0.1;
	static rot_command_authority = 0.01;
	static thrust_command_authority = 0.10;
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
	}

	// Draw the object
	draw(ctx)
	{
		// Draw the body
		ctx.beginPath();
		ctx.arc(0, 0, Fighter.fighterSize, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();

		// Draw the cannon
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -2 * Fighter.fighterSize);
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 3;
		ctx.stroke();
	}

	// Simulate the object
	simulate(dt)
	{
		if (this.controller) { this.controller.control(this, dt); }
		
		// Vel friction
		this.frc.add(this.vel.clone().mul(-Fighter.vel_friction));
		
		// Rotate friction
		this.rotfrc += this.rotvel * -Fighter.rotvel_friction;

		// Collisions
		if (this.pos.x < 0) { this.pos.x = 0; }
		else if (this.pos.x > width) { this.pos.x = width; }
		if (this.pos.y < 0) { this.pos.y = 0; }
		else if (this.pos.y > height) { this.pos.y = height; }
	}

	// Functions for controller
	// Anti cheat functions
	command_thrust(level, dt)
	{
		// console.log(this.fuel);

		if (this.fuel > 0) {
			if (level < 0) { level = 0; }
			if (level > 1) { level = 1; }
	
			let thrustForce = new Vector2(0, -level * Fighter.thrust_command_authority);
			thrustForce.rotate(this.rot);
			this.frc.add(thrustForce);
	
			this.fuel -= level * Fighter.fuel_consumption * dt;
		}
	}

	// Anti cheat functions
	command_rotation(level)
	{
		if (level < -1) { level = -1; }
		if (level > 1) { level = 1; }

		this.rotfrc = level * Fighter.rot_command_authority;
	}

	// Spawn a bullet
	fire()
	{
		// console.log(this.munitions);
		
		if (this.munitions > 0) {
			let bullet = new Bullet(this.pos, this.vel);
	
			// Compute cannon rotation
			let added_vel = new Vector2(0, Fighter.fire_vel);
			added_vel.rotate(this.rot);
			bullet.vel.add(added_vel);
	
			objects.push(bullet);

			this.munitions--;
		}
	}
}
