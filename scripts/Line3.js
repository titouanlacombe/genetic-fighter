class Line3 {
	constructor(point, direction) {
		this.point = point;
		this.direction = direction;
	}

	// Return the minimum distance between 2 3D lines
	dist_to(line) {
		let dir = this.direction.cross(line.direction);

		if (dir.norm() == 0) {
			// Parallel Lines
			return this.direction.clone().normalize().cross(this.point.clone().sub(line.point)).norm();
		}
		else {
			// Skew Lines
			return dir.scalar(this.point.sub(line.point)) / dir.norm();
		}
	}
}
