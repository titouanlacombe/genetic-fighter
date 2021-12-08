// Class Fighter, game object, main player
class Fighter extends GameObject
{
	static fighterSize = 7;
	static rot_command_authority = 1;
	static thrust_command_authority = 1;

	constructor()
	{
		super();

		this.pos.set(50, 50);
		this.vel.set(1, 0);

		this.color = "white";
		this.thrust_level = 0;
	}

	// Spawn a bullet
	fire()
	{
		let bullet = new Bullet(this.pos, this.vel);

		// Compute rotation
		bullet.vel.add(0, 0);

		objects.push(bullet);
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
	}

	command_thrust(level)
	{
		if (level < 0) { level = 0; }
		if (level > 1) { level = 1; }
		
		this.thrust_level = level * Fighter.thrust_command_authority;
	}

	command_rotation(level)
	{
		if (level < -1) { level = -1; }
		if (level > 1) { level = 1; }
		
		this.rotfrc = level * Fighter.rot_command_authority;
	}

	command_player(code)
	{
		if (code == "z") {
			this.command_thrust(1);
		}
		else if (code == "s") {
			this.fire();
		}
		else if (code == "q") {
			this.command_rotation(1);
		}
		else if (code == "d") {
			this.command_rotation(-1);
		}
	}
}
