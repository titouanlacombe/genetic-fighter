class Vector2
{
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	clone() {
		return new Vector2(this.x, this.y);
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

function dist(v1, v2) {
	let d = v1.clone();
	return d.sub(v2);
}
