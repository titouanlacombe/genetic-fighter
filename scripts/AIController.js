class AIController extends Controller {
	static vision_range = 1000;

	constructor() {
		super();

		// DNA
		this.min_fighter_dist = 100;
		this.max_fighter_dist = 300;
		
		this.min_fire_error = 0.05;

		// Variables
		this.focused = null;
		this.init_states();
	}

	// Can't be static cause the exit condition changes depending on AI DNA
	init_states() {
		// let suicide = new State("suicide");
		let fleeing = new State("fleeing");
		let turret = new State("turret");
		let aiming = new State("aiming");
		let positionning = new State("positionning");
		let searching = new State("searching");

		searching.add_exit(positionning, (object) => { return object.controller.focused != null; });

		positionning.add_exit(aiming, (object) => {
			let d = object.controller.focused.dist_to(object);
			return d < this.max_fighter_dist && d > this.min_fighter_dist;
		});

		positionning.add_exit(searching, (object) => { return object.controller.focused == null; });
		aiming.add_exit(searching, (object) => { return object.controller.focused == null; });

		positionning.add_exit(turret, (object) => { return object.fuel <= 0; });
		aiming.add_exit(turret, (object) => { return object.fuel <= 0; });

		positionning.add_exit(fleeing, (object) => { return object.munitions <= 0; });
		aiming.add_exit(fleeing, (object) => { return object.munitions <= 0; });

		this.state = searching;
	}

	get_near_by_objects(object) {
		let near = [];
		objects.forEach(object2 => {
			if (object != object2 &&
				object.dist_to(object2) < AIController.vision_range) {
				near.push(object2);
			}
		});
		return near;
	}

	// Choose closest fighter
	// Bias via ones in front (TODO)
	change_focus(object, near_by_objects) {
		let min_distance = Infinity;
		near_by_objects.forEach(potential => {
			if (potential instanceof Fighter) {
				let distance = object.dist_to(potential);
				if (distance < min_distance) {
					this.focused = potential;
					min_distance = distance;
				}
			}
		});
	}

	manage_focus(object, near_by_objects) {
		// Change focus if => too far or dead
		if (this.focused) {
			if (!this.focused.alive ||
				this.focused.dist_to(object) > this.loose_focus_dist) {
				this.focused = null;
			}
		}

		// Try to find new focus
		if (!this.focused) {
			this.change_focus(object, near_by_objects);
		}
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
			"fire": this.do_fire(tagret, current_aim),
		};
	}

	turret(object, near_by_objects) {
		return {
			"rotation": 0,
			"fire": this.do_fire(tagret, current_aim),
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

		ctx.save();
		ctx.translate(object.pos.x, object.pos.y);
		ctx.lineWidth = 2;

		// Manage focus
		let near_by_objects = this.get_near_by_objects(object);
		this.manage_focus(object, near_by_objects);

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

		let target = this.get_target_angle(object, this.focused);
		this.command_fire(current_aim, target);

		ctx.restore();

		return command;
	}
}