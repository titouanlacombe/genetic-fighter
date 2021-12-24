class AIController extends Controller {
	static vision_range = 500;

	constructor() {
		super();

		// DNA
		this.min_fighter_dist = 100;
		this.max_fighter_dist = 300;

		this.min_fire_error = 0.05;

		this.encounter_time_max = 20;
		this.encounter_dist_max = 5;

		// Variables
		this.target = null;

		// Init AI states
		this.init_states();
	}

	// Can't be static function because the exit condition changes depending on the AI DNA
	init_states() {
		// let suicide = new State("suicide");
		let searching = new State("searching");
		let aiming = new State("aiming");
		let fleeing = new State("fleeing");
		let positionning = new State("positionning");
		let turret = new State("turret");

		// --- "aiming" state ---
		// Switch to "positionning" if target not at good distance
		aiming.add_exit(positionning, (object) => {
			let d = object.dist_to(this.target);
			return d < this.min_fighter_dist || d > this.max_fighter_dist;
		});

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

		// --- "positionning" state ---
		// Switch to "aiming" if target is in range
		positionning.add_exit(aiming, (object) => {
			if (!object.controller.target) {
				return false;
			}
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

		// --- "searching" state ---
		// Switch to "positionning" when finds a target
		searching.add_exit(positionning, (object) => {
			return object.controller.target != null;
		});

		this.state = searching;
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
				this.target.dist_to(object) > AIController.vision_range) {
				this.target = null;
			}
		}

		// If no target try to find new target
		if (!this.target) {
			this.find_target(object, near_by_objects);
		}
	}

	get_firering_angle(object) {
		let result = TrajectoryPredictor.get_firering_angle(object, this.target, Fighter.fire_vel);

		if (result != null) {
			let target_pos = this.target.pos.clone().add(this.target.vel.clone().mul(result.dt));

			// draw red point at target x bullet intersection
			ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.arc(target_pos.x, target_pos.y, 5, 0, 2 * Math.PI);
			ctx.fill();
		}

		return result.angle;
	}

	// fire if current aim close enough to targeted aim && cooldown passed
	do_fire(target, current_aim) {
		return Math.abs(target - current_aim) < this.min_fire_error;
	}

	get_evading_vector(object, near_by_objects) {
		let evading_v = new Vector2();

		for (const obj of near_by_objects) {
			let encounter = TrajectoryPredictor.get_encounter(object, obj);
			let dist = encounter.pos1.clone().sub(encounter.pos2);

			if (encounter.dt < this.encounter_time_max
				&& dist.norm() - obj.radius - object.radius < this.encounter_dist_max)
			{
				// Evade
				let score = 1;
				evading_v.add(dist.mul(score));
			}
		}

		return evading_v;
	}

	searching(object, near_by_objects) {
		return {
			"thrust": 0,
			"rotation": 0,
		};
	}

	positionning(object, near_by_objects) {
		let angle = this.get_firering_angle(object);

		return {
			"thrust": 0,
			"rotation": 0,
		};
	}

	aiming(object, near_by_objects) {
		let angle = this.get_firering_angle(object);

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
		console.log(this.state.code);

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