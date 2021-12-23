class TrajectoryPredictor
{
	// Return the time to (in sim time) obj1 & obj2 are the closest
	// this function asumes objects keep their current speed 
	static time_to_encounter(obj1, obj2) {
		// --- Math proof ---
		// Position equation of an object
		// pi(t) = vi0*t + pi0

		// Distance between object a & b
		// dist(t) = t*(va0 - vb0) + (pa0 - pb0)
		// dist(t) = t*dv + dp

		// Norm of the distance
		// ||dist(t)|| = sqrt((t*dv.x + dp.x)**2 + (t*dv.y + dp.y)**2)

		// Derivative of the norm
		// d||dist(t)||/dt = (2*dvx*(t*dvx + dpx) + 2*dvy*(t*dvy + dpy)) / (2*sqrt((t*dvx + dpx)**2 + (t*dvy + dpy)**2))

		// Solving eq: d||dist(t)||/dt = 0
		// 0 = (2*dvx*(t*dvx + dpx) + 2*dvy*(t*dvy + dpy)) / (2*sqrt((t*dvx + dpx)**2 + (t*dvy + dpy)**2))
		// 0 = 2*dvx*(t*dvx + dpx) + 2*dvy*(t*dvy + dpy)
		// 0 = dvx*(t*dvx + dpx) + dvy*(t*dvy + dpy)
		// 0 = t*dvx**2 + dvx*dpx + t*dvy**2 + dvy*dpy
		// 0 = t*(dvx**2 + dvy**2) + dvx*dpx + dvy*dpy
		// t*(dvx**2 + dvy**2) = -(dvx*dpx + dvy*dpy)
		// t = -(dvx*dpx + dvy*dpy) / (dvx**2 + dvy**2)

		// CQFD we have t when dist is at a minimum
		
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

	static pos_at_time(obj, dt) {
		return obj.pos.clone().add(obj.vel.clone().mul(dt));
	}

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
}