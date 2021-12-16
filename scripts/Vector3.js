// 3D Vector class
class Vector3 extends Vector
{
	constructor(x = 0, y = 0, z = 0) {
		super([x, y, z]);
	}

	set(x = 0, y = 0, z = 0) {
		this.data[0] = x;
		this.data[1] = y;
		this.data[2] = z;
		return this;
	}

	clone() {
		return new Vector3(this.data[0], this.data[1], this.data[2]);
	}
}
