/**
 * Usefull functions to predict trajectory of game objects by assuming no friction
 */
class TrajectoryPredictor {
	/**
	 * Return the time (in sim time) until obj1 & obj2 are the closest
	 * This function asumes objects keep their current speed
	 * @param {GameObject} obj1 
	 * @param {GameObject} obj2 
	 * @returns {Number}
	 */
	static time_to_encounter(obj1, obj2) {
		/*
		--- Math proof ---
		Position equation of an object
		pi(t) = vi0*t + pi0

		Distance between object a & b
		dist(t) = t*(va0 - vb0) + (pa0 - pb0)
		dist(t) = t*dv + dp

		Norm of the distance
		||dist(t)|| = sqrt((t*dv.x + dp.x)**2 + (t*dv.y + dp.y)**2)

		Derivative of the norm
		d||dist(t)||/dt = (2*dvx*(t*dvx + dpx) + 2*dvy*(t*dvy + dpy)) / (2*sqrt((t*dvx + dpx)**2 + (t*dvy + dpy)**2))

		Solving eq: d||dist(t)||/dt = 0
		0 = (2*dvx*(t*dvx + dpx) + 2*dvy*(t*dvy + dpy)) / (2*sqrt((t*dvx + dpx)**2 + (t*dvy + dpy)**2))
		0 = 2*dvx*(t*dvx + dpx) + 2*dvy*(t*dvy + dpy)
		0 = dvx*(t*dvx + dpx) + dvy*(t*dvy + dpy)
		0 = t*dvx**2 + dvx*dpx + t*dvy**2 + dvy*dpy
		0 = t*(dvx**2 + dvy**2) + dvx*dpx + dvy*dpy
		t*(dvx**2 + dvy**2) = -(dvx*dpx + dvy*dpy)
		t = -(dvx*dpx + dvy*dpy) / (dvx**2 + dvy**2)

		We have t when dist is at a minimum
		CQFD
		*/

		let dv = obj1.vel.clone().sub(obj2.vel);
		let dp = obj1.pos.clone().sub(obj2.pos);

		// If objects have the same speed, they have a parallel trajectory and never meet
		if (dv.norm() == 0) {
			return Infinity;
		}

		let t = - (dv.x() * dp.x() + dv.y() * dp.y()) / (dv.x() ** 2 + dv.y() ** 2);

		// If encounter is in the past, there is no next one
		if (t < 0) {
			return Infinity;
		}

		return t;
	}

	/**
	 * Return the position of object at dt from now
	 * @param {GameObject} obj 
	 * @param {Number} dt 
	 * @returns {Vector2}
	 */
	static pos_at_time(obj, dt) {
		return obj.pos.clone().add(obj.vel.clone().mul(dt));
	}

	/**
	 * Return an encounter object (time to encounter, position of objects 1 & 2)
	 * An encounter is the moment in time where two objects are the closest together
	 * @param {GameObject} obj1 
	 * @param {GameObject} obj2 
	 * @returns {EncounterObject}
	 */
	static get_encounter(obj1, obj2) {
		let dt = this.time_to_encounter(obj1, obj2);

		let pos1 = this.pos_at_time(obj1, dt);
		let pos2 = this.pos_at_time(obj2, dt);

		return {
			"dt": dt,
			"pos1": pos1,
			"pos2": pos2,
		};
	}

	/**
	 * Return the angle wich obj need to fire in order to hit target
	 * This function asumes objects keep their current speed
	 * @param {GameObject} obj The firering object
	 * @param {GameObject} target The targeted object
	 * @param {Number} vel_cannon_norm The bullets exit velocities
	 * @returns {Number | null} null if no solutions where found
	 */
	static get_firering_angle(obj, target, vel_cannon_norm) {
		/*
		--- Math proof ---
		First step: Expressing vel_cannon
		Constraining system by collision at some unknown time
		pos_bullet(dt) = pos_target(dt)
		pos_object(0) + vel_bullet(0) * dt = pos_target(0) + vel_target(0) * dt
		vel_bullet(0) * dt = (pos_target(0) - pos_object(0)) + vel_target(0) * dt
		(vel_object(0) + vel_cannon) * dt = ||
		vel_cannon * dt = (pos_target(0) - pos_object(0)) + (vel_target(0) - vel_object(0)) * dt
		vel_cannon = diff_pos / dt + diff_vel

		Second step: Finding dt
		Constraining system by norm of the vel
		||vel_cannon|| = ||diff_pos / dt + diff_vel|| = vel_cannon_norm
		||diff_pos / dt + diff_vel|| = vel_cannon_norm
		(diff_pos.x / dt + diff_vel.x)^2 + (diff_pos.y / dt + diff_vel.y)^2 = vel_cannon_norm^2
		(diff_pos.x / dt)^2 + 2*(diff_pos.x / dt)*diff_vel.x + diff_vel.x^2 + (diff_pos.y / dt)^2 + 2*(diff_pos.y / dt)*diff_vel.y + diff_vel.y^2 = vel_cannon_norm^2
		diff_vel.x^2 + diff_vel.y^2 => dist_vel^2
		diff_pos.x^2 / dt^2 + diff_pos.y^2 / dt^2 => dist^2 / dt^2
		dist^2 / dt^2 + dist_vel^2 + 2*(diff_pos.x / dt)*diff_vel.x + 2*(diff_pos.y / dt)*diff_vel.y = vel_cannon_norm^2
		dist^2 / dt^2 + dist_vel^2 + (2/dt)*(diff_pos.x*diff_vel.x + diff_pos.y*diff_vel.y) = vel_cannon_norm^2
		dist^2 / dt^2 + dist_vel^2 - vel_cannon_norm^2 + (2/dt)*(diff_pos.x*diff_vel.x + diff_pos.y*diff_vel.y) = 0
		dt^2*(dist_vel^2 - vel_cannon_norm^2) + 2*dt*(diff_pos.x*diff_vel.x + diff_pos.y*diff_vel.y) + dist^2 = 0
		dt^2*(dist_vel^2 - vel_cannon_norm^2) + 2*dt*diff_pos.scalar(diff_vel) + dist^2 = 0
		dt^2*A + dt*B + C = 0
		With:
		A = dist_vel^2 - vel_cannon_norm^2
		B = 2*diff_pos.scalar(diff_vel)
		C = dist^2

		Juste solve and find dt
		Choose the best dt (return null if imposible)

		Final step: Finding angle
		vel_cannon = diff_pos / dt + diff_vel
		angle(vel_cannon) = angle(diff_pos / dt + diff_vel)
		CQFD
		*/

		// --- Code ---
		// Finding dt
		let diff_pos = target.pos.clone().sub(obj.pos);
		let diff_vel = target.vel.clone().sub(obj.vel);

		let A = diff_vel.squared_norm() - vel_cannon_norm ** 2;
		let B = 2 * diff_pos.scalar(diff_vel);
		let C = diff_pos.squared_norm();

		let solutions = resolve_poly2(A, B, C);

		// If no solutions
		if (solutions.length == 0) {
			return null;
		}

		// Sort to help in choice
		solutions.sort();

		// If max negative: solutions invalid (because in the past)
		if (solutions[solutions.length - 1] < 0) {
			return null;
		}

		// Choice of dt: smalest non negative
		let i = 0;
		while (solutions[i] < 0) {
			i++;
		}
		let dt = solutions[i];
		// console.log(dt);

		// Finding vel_cannon
		let vel_cannon = diff_pos.div(dt).add(diff_vel);

		return {
			"angle": vel_cannon.angle(),
			"dt": dt,
		};
	}
}