// 2D Vector class
class Vector2 extends Vector
{
	constructor(x = 0, y = 0) {
		super([x, y]);
	}
	
	x() {
		return this.data[0];
	}

	y() {
		return this.data[1];
	}

	setx(v) {
		this.data[0] = v;
		return this;
	}

	sety(v) {
		this.data[1] = v;
		return this;
	}

	set(x = 0, y = 0) {
		this.setx(x);
		this.sety(y);
		return this;
	}

	clone() {
		return new Vector2(this.x(), this.y());
	}

	// Rotate vecor by the angle (rad)
	rotate(angle) {
		let cs = Math.cos(angle);
		let sn = Math.sin(angle);
		let tempX = this.x(); // Very important
		this.setx(this.x() * cs - this.y() * sn);
		this.sety(tempX * sn + this.y() * cs);
		return this;
	}

	// angle of the vector (rad)
	angle() {
		return Math.atan2(this.y(), this.x());
	}

	// Draw a debug of the vector at ctx
	draw(ctx, color = Color.white, scale = 1) {
		let v = this.clone().mul(scale);
		ctx.strokeStyle = color;

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(v.x(), v.y());
		ctx.stroke();
		
		return this;
	}
	
	// Create a unit vector from an angle
	static fromAngle(angle) {
		return new Vector2(Math.cos(angle), Math.sin(angle));
	}
}
