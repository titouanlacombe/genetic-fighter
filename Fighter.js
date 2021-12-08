// Class Fighter, game object, main player
class Fighter extends GameObject
{
	constructor() {
		super();
		this.pos = new Vector2(50, 50);
		this.vel = new Vector2(1, 0);
		this.frc = new Vector2(0, 0);

		this.color = "white";
	}

	// Apply euler integration to the object properties
	euler(dt) {
		this.vel.add(this.frc.mul(dt));
		this.pos.add(this.vel.clone().mul(dt));
		
		this.frc.mul(0);
	}
	
	// Draw the object
	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, 20, 0, 2*Math.PI);
		ctx.fill();
	}
	
	// Simulate the object
	simulate(dt) {
		this.euler(dt);
	}
}
