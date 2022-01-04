class AIController extends Controller {
	static vision_range = 500;

	constructor() {
		super();

		// --- DNA ---
		this.min_fighter_dist = 50;
		this.max_fighter_dist = 400;
		this.wanted_target_dist = 150;

		this.min_fire_error = 0.05;

		this.encounter_time_max = 20;
		this.encounter_dist_max = 5;

		this.positionning_K = 1;
		this.searching_K = 1;

		// PID settings
		this.angle_Kp = 0.3;
		this.angle_Ki = 0.5;
		this.angle_Kd = 0.3;
		
		this.vel_Kp = 0.3;
		this.vel_Ki = 0.5;
		this.vel_Kd = 0.3;

		// --- non DNA ---
		// PID
		this.angle_pid = new PIDController(this.angle_Kp, this.angle_Ki, this.angle_Kd);
		this.vel_pid = new PIDController(this.vel_Kp, this.vel_Ki, this.vel_Kd);

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
			if (!this.target) {
				return false;
			}

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

	get_angle(object) {
		return object.angle - Math.PI / 2;
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
			// Relative pos
			target_pos.sub(object.pos);

			// Draw angle
			// Vector2.fromAngle(result.angle).draw(ctx, Color.red, 30);
			
			// console.log(target_pos);
			// console.log(result.dt);
			// console.log(result.angle);
			
			// Draw red point at target x bullet intersection
			ctx.beginPath();
			ctx.arc(target_pos.x, target_pos.y, 5, 0, 2 * Math.PI);
			ctx.fill();
		}

		return result.angle;
	}

	// fire if current aim close enough to targeted aim && cooldown passed
	do_fire(current_angle, target_angle) {
		return Math.abs(current_angle - target_angle) < this.min_fire_error;
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

	control_from_vector(object, speed_target) {
		let object_angle = this.get_angle(object);

		let target_angle = speed_target.angle();
		let target_vel = Vector2.fromAngle(object_angle).scalar(speed_target);

		// Vector2.fromAngle(target_angle).normalize(target_vel).draw(ctx, "blue", 1);

		return {
			"thrust": this.vel_pid.control(object.vel.norm(), target_vel, dt),
			"rotation": this.angle_pid.control(object_angle, target_angle, dt),
		};
	}

	searching(object, near_by_objects) {
		let speed_target = new Vector2();

		// Go to center
		let center = new Vector2(width / 2, height / 2);
		let diff_pos = center.sub(object.pos);
		speed_target.add(diff_pos.mul(this.searching_K));
		speed_target.add(this.get_evading_vector(object, near_by_objects));

		return this.control_from_vector(object, speed_target);
	}

	positionning(object, near_by_objects) {
		let speed_target = new Vector2();
		
		// Constrain target distance to object
		let diff_pos = this.target.pos.clone().sub(object.pos);
		let target_pos = diff_pos.clone().normalize(this.wanted_target_dist);
		let error = diff_pos.sub(target_pos);
		// error.draw(ctx, "red", 1);

		speed_target.add(error.mul(this.positionning_K));

		speed_target.add(this.get_evading_vector(object, near_by_objects));
		
		return this.control_from_vector(object, speed_target);
	}

	aiming(object, near_by_objects) {
		let target_angle = this.get_firering_angle(object);
		let object_angle = this.get_angle(object);

		return {
			"thrust": 1, // Min thrust
			"rotation": this.angle_pid.control(object_angle, target_angle, dt),
			"fire": this.do_fire(object_angle, target_angle),
		};
	}

	turret(object, near_by_objects) {
		let target_angle = this.get_firering_angle(object);
		let object_angle = this.get_angle(object);

		return {
			"rotation": this.angle_pid.control(object_angle, target_angle, dt),
			"fire": this.do_fire(object_angle, target_angle),
		};
	}

	fleeing(object, near_by_objects) {
		let speed_target = new Vector2();

		speed_target.add(this.get_evading_vector(object, near_by_objects));

		return this.control_from_vector(object, speed_target);
	}

	change_state(new_state) {
		// console.log("Changing state to: " + this.state.code);

		this.state = new_state;

		// Resets the pid
		this.angle_pid.reset_prev();
	}

	control(_object) {
		const object = _object;

		// Debug drawing context
		ctx.translate(object.pos.x(), object.pos.y());
		ctx.strokeStyle = "red";
		ctx.fillStyle = "red";
		ctx.lineWidth = 2;
		
		// Manage target
		let near_by_objects = CollisionManager.get_near_objects(object, AIController.vision_range, "space");
		this.manage_target(object, near_by_objects);

		// Manage state
		let new_state = this.state.update(object);
		if (new_state != this.state) {
			this.change_state(new_state);
		}

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