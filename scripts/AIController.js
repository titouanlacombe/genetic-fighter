class AIController extends Controller {
	static vision_range = 1000;

	constructor() {
		super();

		// DNA
		this.min_fighter_dist = 100;
		this.max_fighter_dist = 300;

		this.min_fire_error = 0.05;

		// Variables
		this.target = null;

		// Init AI states
		this.init_states();
	}

	// Can't be static function because the exit condition changes depending on the AI DNA
	init_states() {
		// let suicide = new State("suicide");
		let aiming = new State("aiming");
		let fleeing = new State("fleeing");
		let positionning = new State("positionning");
		let searching = new State("searching");
		let turret = new State("turret");

		// "aiming" state

		// Switch to "searching" if has no target
		aiming.add_exit(searching, (object) => {
			return object.controller.target == null;
		});

		// Switch to "turret" if has no fuel
		aiming.add_exit(turret, (object) => {
			return object.fuel <= 0;
		});

		// Switch to "fleeing" if has no munitions
		aiming.add_exit(fleeing, (object) => {
			return object.munitions <= 0;
		});


		// "positionning" state

		// Switch to "aiming" if target is in range
		positionning.add_exit(aiming, (object) => {
			let d = object.controller.target.dist_to(object);
			return d < this.max_fighter_dist && d > this.min_fighter_dist;
		});

		//	Switch to "searching" if has no target
		positionning.add_exit(searching, (object) => {
			return object.controller.target == null;
		});

		// Switch to "turret" if has no fuel
		positionning.add_exit(turret, (object) => {
			return object.fuel <= 0;
		});

		// Switch to "fleeing" if has no munitions
		positionning.add_exit(fleeing, (object) => {
			return object.munitions <= 0;
		});

		// "searching" state

		// Switch to "positionning" when finds a target
		searching.add_exit(positionning, (object) => {
			return object.controller.target != null;
		});

		this.state = searching;
	}
	
	// Return the time to (in sim time) obj1 & obj2 are the closest
	// this function asumes objects keep their current speed 
	time_to_ecounter(obj1, obj2) {
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

		// If ecounter is in the past, there is no next one
		if (t < 0) {
			return Infinity;
		}

		return t;
	}

	// Choose closest fighter
	// Bias via ones in front (TODO)
	find_target(object, near_by_objects) {
		let min_distance = Infinity;
		for (let potential of near_by_objects) {
			if (potential instanceof Fighter) {
				let distance = object.dist_to(potential);
				if (distance < min_distance) {
					this.target = potential;
					min_distance = distance;
				}
			}
		}
	}

	manage_target(object, near_by_objects) {
		// Loose target if => too far or dead
		if (this.target) {
			if (!this.target.alive ||
				this.target.dist_to(object) > Fighter.vision_range) {
				this.target = null;
			}
		}

		// If no target try to find new target
		if (!this.target) {
			this.find_target(object, near_by_objects);
		}
	}

	get_target_angle(object) {
		// Use target
		return 0;
	}

	// fire if current aim close enough to targeted aim && cooldown passed
	do_fire(target, current_aim) {
		return Math.abs(target - current_aim) < this.min_fire_error;
	}

	searching(object, near_by_objects) {
		return {
			"thrust": 0,
			"rotation": 0,
		};
	}

	positionning(object, near_by_objects) {
		return {
			"thrust": 0,
			"rotation": 0,
		};
	}

	aiming(object, near_by_objects) {
		return {
			"thrust": 0, // Min thrust ?
			"rotation": 0,
			"fire": this.do_fire(0, 0),
		};
	}

	turret(object, near_by_objects) {
		return {
			"rotation": 0,
			"fire": this.do_fire(0, 0),
		};
	}

	fleeing(object, near_by_objects) {
		return {
			"thrust": 0,
			"rotation": 0,
		};
	}

	control(_object) {
		const object = _object;

		// Debug drawing context
		ctx.translate(object.pos.x(), object.pos.y());
		ctx.lineWidth = 2;

		// Manage target
		let near_by_objects = CollisionManager.get_near_objects(object, AIController.vision_range, "space");
		this.manage_target(object, near_by_objects);

		// Manage state
		this.state = this.state.update(object);

		let command = {};
		switch (this.state.code) {
			case "searching":
				command = this.searching(object, near_by_objects);
				break;

			case "positionning":
				command = this.positionning(object, near_by_objects);
				break;

			case "aiming":
				command = this.aiming(object, near_by_objects);
				break;

			case "turret":
				command = this.turret(object, near_by_objects);
				break;

			case "fleeing":
				command = this.fleeing(object, near_by_objects);
				break;

			default:
				console.log("Unknown state: " + this.state.code);
				break;
		}

		ctx.resetTransform();

		return command;
	}
}