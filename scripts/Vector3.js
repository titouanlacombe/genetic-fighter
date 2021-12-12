// 2D Vector class
class Vector3 extends Vector2
{
	constructor(x = 0, y = 0, z = 0) {
		super(x, y);
		
		this.z = z;
	}

	// Set x & y & z
	set(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	// Set same as vector
	set_v(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}

	// Return a copy
	clone() {
		return new Vector3(this.x, this.y, this.z);
	}

	// Add
	add(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	// Substract
	sub(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	// Multiply
	mul(s) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}
	
	// Divide
	div(s) {
		this.x /= s;
		this.y /= s;
		this.z /= s;
		return this;
	}

	// norm of the vector
	norm() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
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
		return v.x * this.x + v.y * this.y + v.z * this.z;
	}

	// Draw a debug of the vector at ctx
	draw(ctx, color = Color.white, scale = 1) {
        throw new Error();
	}
	
	// Create a unit vector from an angle
	static fromAngle(angle) {
        throw new Error();
	}
}
