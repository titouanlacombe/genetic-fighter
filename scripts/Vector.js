class Vector
{
	constructor(data) {
		this.data = data;
	}

	set() {
		throw new Error();
	}

	// Set same as vector
	setv(v) {
		this.data = v.data.slice();
		return this;
	}

	// Return a copy
	clone() {
		return new Vector(this.data);
	}

	// Add
	add(v) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] += v.data[i];
		}
		return this;
	}

	// Substract
	sub(v) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] -= v.data[i];
		}
		return this;
	}

	// Multiply
	mul(s) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] *= s;
		}
		return this;
	}
	
	// Divide
	div(s) {
		return this.mul(1 / s);
	}

	// squared norm of the vector
	squared_norm() {
		let sum = 0;
		for (let value of this.data) {
			sum += value * value;
		}
		return sum;
	}

	// norm of the vector
	norm() {
		return Math.sqrt(this.squared_norm());
	}

	// Normalize a vector to norm
	normalize(norm = 1) {
		let current_norm = this.norm();
		
		if (current_norm == 0) {
			// Do nothing
			return this;
		}

		this.mul(norm / current_norm);
		return this;
	}

	// Rotate vecor by the angle (rad)
	rotate(angle) {
		throw new Error();
	}

	// angle of the vector (rad)
	angle() {
		throw new Error();
	}

	// Scalar multiplication
	scalar(v) {
		let sum = 0;
		for (let i = 0; i < this.data.length; i++) {
			sum += this.data[i] * v.data[i];
		}
		return sum;
	}

	// Draw a debug of the vector at ctx
	draw() {
		throw new Error();
	}
	
	// Create a unit vector from an angle
	static fromAngle(angle) {
		throw new Error();
	}
}
