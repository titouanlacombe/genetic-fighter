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
	}

	setV(v) {
		this.x = v.x;
		this.y = v.y;
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	rotate(angle) {
		let cs = Math.cos(angle);
		let sn = Math.sin(angle);
		this.x = this.x * cs - this.y * sn;
		this.y = this.x * sn + this.y * cs;
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
}

// Return a new vector wich is the distance between 2 vectors
function dist(v1, v2) {
	let d = v1.clone();
	return d.sub(v2);
}
