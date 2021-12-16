// 2D Vector class
class Vector2 extends Vector
{
	constructor(x = 0, y = 0) {
		super([x, y]);
	}

	set(x = 0, y = 0) {
		this.data[0] = x;
		this.data[1] = y;
		return this;
	}

	clone() {
		return new Vector2(this.data[0], this.data[1]);
	}

	// Rotate vecor by the angle (rad)
	rotate(angle) {
		let cs = Math.cos(angle);
		let sn = Math.sin(angle);
		let tempX = this.data[0]; // Very important
		this.data[0] = this.data[0] * cs - this.data[1] * sn;
		this.data[1] = tempX * sn + this.data[1] * cs;
		return this;
	}

	// angle of the vector (rad)
	angle() {
		return Math.atan2(this.data[1], this.data[0]);
	}

	// Draw a debug of the vector at ctx
	draw(ctx, color = Color.white, scale = 1) {
		let v = this.clone().mul(scale);
		ctx.strokeStyle = color;

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(v.data[0], v.data[1]);
		ctx.stroke();
	}
	
	// Create a unit vector from an angle
	static fromAngle(angle) {
		return new Vector2(Math.cos(angle), Math.sin(angle));
	}
}
