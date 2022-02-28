/**
 * Generic Vector class
 */
class Vector {
	/**
	 * Create a generic vector
	 * @param {Array} data Array of length dimension
	 */
	constructor(data) {
		this.data = data;
	}

	/**
	 * Set Vector data
	 * @returns {Vector} this
	 */
	set(data) {
		this.data = data;
		return this;
	}

	/**
	 * Copy from another vector
	 * @param {Vector} v vector to copy
	 * @returns {Vector} this
	 */
	setv(v) {
		this.data = v.data.slice();
		return this;
	}

	/**
	 * Return a copy of this vector
	 * @returns {Vector} copy
	 */
	clone() {
		return new Vector(this.data);
	}

	/**
	 * Add v to this
	 * @param {Vector} v 
	 * @returns {Vector} this
	 */
	add(v) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] += v.data[i];
		}
		return this;
	}

	/**
	 * Substract v from this
	 * @param {Vector} v 
	 * @returns {Vector} this
	 */
	sub(v) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] -= v.data[i];
		}
		return this;
	}

	/**
	 * Multiply this by s
	 * @param {Number} s
	 * @returns {Vector} this
	 */
	mul(s) {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] *= s;
		}
		return this;
	}

	/**
	 * Divide this by s
	 * @param {Number} s
	 * @returns {Vector} this
	 */
	div(s) {
		return this.mul(1 / s);
	}

	/**
	 * Return the squared norm of the vector (faster than the norm)
	 * @returns {Number} squared vector norm
	 */
	squared_norm() {
		let sum = 0;
		for (let value of this.data) {
			sum += value * value;
		}
		return sum;
	}

	/**
	 * Return the norm of the vector (slow because of sqrt)
	 * @returns {Number} vector norm
	 */
	norm() {
		return Math.sqrt(this.squared_norm());
	}

	/**
	 * Normalize the vector to norm
	 * @returns {Vector} this
	 */
	normalize(norm = 1) {
		let current_norm = this.norm();

		if (current_norm == 0) {
			// Do nothing
			return this;
		}

		this.mul(norm / current_norm);
		return this;
	}

	/**
	 * Return the scalar multiplication of this & v
	 * @returns {Number} scalar
	 */
	scalar(v) {
		let sum = 0;
		for (let i = 0; i < this.data.length; i++) {
			sum += this.data[i] * v.data[i];
		}
		return sum;
	}

	isNaN() {
		for (const data of this.data) {
			if (isNaN(data)) {
				return true;
			}
		}
		return false;
	}
}
