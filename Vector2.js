// 2D Vector class
class Vector2
{
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	set(x = 0, y = 0) {
		this.x = x;
		this.y = y;
		return this;
	}

	setV(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	rotate(angle) {
		let cs = Math.cos(angle);
		let sn = Math.sin(angle);
		let tempX = this.x; // Very important
		this.x = this.x * cs - this.y * sn;
		this.y = tempX * sn + this.y * cs;
		return this;
	}

	angle() {
		return Math.atan2(this.y, this.x);
	}

	scalar(v) {
		return v.x * this.x + v.y * this.y;
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	sub(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	mul(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}
	
	div(s) {
		this.x /= s;
		this.y /= s;
		return this;
	}

	norm() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize(norm = 1) {
		let current_norm = this.norm();
		if (current_norm == 0) {
			return this;
		}

		this.mul(norm / current_norm);
		return this;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
	}
}

// Return a new vector wich is the distance between 2 vectors
function dist(v1, v2) {
	let d = v1.clone();
	return d.sub(v2);
}
