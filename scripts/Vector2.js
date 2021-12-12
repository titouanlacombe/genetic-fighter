// 2D Vector class
class Vector2
{
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	// Set x & y
	set(x = 0, y = 0) {
		this.x = x;
		this.y = y;
		return this;
	}

	// Set same as vector
	set_v(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	// Return a copy
	clone() {
		return new Vector2(this.x, this.y);
	}

	// Add
	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	// Substract
	sub(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	// Multiply
	mul(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}
	
	// Divide
	div(s) {
		this.x /= s;
		this.y /= s;
		return this;
	}

	// norm of the vector
	norm() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	// Normalize a vector to norm
	normalize(norm = 1) {
		let current_norm = this.norm();
		if (current_norm == 0) {
			return this;
		}

		this.mul(norm / current_norm);
		return this;
	}

	// Rotate vecor by the angle (rad)
	rotate(angle) {
		let cs = Math.cos(angle);
		let sn = Math.sin(angle);
		let tempX = this.x; // Very important
		this.x = this.x * cs - this.y * sn;
		this.y = tempX * sn + this.y * cs;
		return this;
	}

	// angle of the vector (rad)
	angle() {
		return Math.atan2(this.y, this.x);
	}

	// Scalar multiplication
	scalar(v) {
		return v.x * this.x + v.y * this.y;
	}

	// Draw a debug of the vector at ctx
	draw(ctx, color = Color.white, scale = 1) {
		let v = this.clone().mul(scale);
		ctx.strokeStyle = color;

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(v.x, v.y);
		ctx.stroke();
	}
	
	// Create a unit vector from an angle
	static fromAngle(angle) {
		return new Vector2(Math.cos(angle), Math.sin(angle));
	}
}
