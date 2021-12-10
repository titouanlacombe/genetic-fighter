class AIController extends Controller {
	static vision_range = 1000;

	constructor() {
		super();

		// DNA
		this.rotation_sensibility = 0.5;
		this.cannon_fire_cooldown = 4;
		this.min_fire_error = 0.05;
		this.loose_focus_dist = 500;
		this.direction_importance = 1;
		this.aim_importance = 2;
		this.target_speed = 2;
		this.avoid_fighter_k = 0.5;
		this.wanted_fighter_dist = 200;
		this.avoid_bullet_k = 3;
		this.min_bullet_dist = 40;
		this.min_thrust = 0.1;

		// Variables
		this.focused = null;
		this.cannon_cooldown = 0;
	}

	// Choose closest fighter
	// Bias via ones in front (TODO)
	change_focus(object, near_by_objects) {
		let min_distance = Infinity;
		near_by_objects.forEach(potential => {
			if (potential instanceof Fighter) {
				let distance = Vector2.dist(object.pos, potential.pos).norm();
				if (distance < min_distance) {
					this.focused = potential;
					min_distance = distance;
				}
			}
		});
	}

	get_near_by_objects(object) {
		let near = [];
		objects.forEach(object2 => {
			if (object != object2 &&
				Vector2.dist(object.pos, object2.pos).norm() < AIController.vision_range) {
				near.push(object2);
			}
		});
		return near;
	}

	manage_focus(object, near_by_objects) {
		// Change focus if => too far or dead
		if (this.focused) {
			if (!this.focused.alive ||
				Vector2.dist(this.focused.pos, object.pos).norm() > this.loose_focus_dist) {
				this.focused = null;
			}
		}

		// Try to find new focus
		if (!this.focused) {
			this.change_focus(object, near_by_objects);
		}
	}

	// fire if current aim close enough to targeted aim && cooldown passed
	control_cannon(object, target, current_aim) {
		if (this.cannon_cooldown < 0 &&
			Math.abs(target - current_aim) < this.min_fire_error) {
			// Try to fire
			if (object.fire()) {
				// If success reset cooldown
				this.cannon_cooldown = this.cannon_fire_cooldown;
			}
		} else {
			this.cannon_cooldown -= dt;
		}
	}

	manage_direction(object, near_by_objects) {
		// vector representing the direction & speed we want to go
		let target_vel = new Vector2();

		near_by_objects.forEach(threat => {
			let distance_v = Vector2.dist(object.pos, threat.pos);
			let distance = distance_v.norm();
			
			if (distance != 0) {
				// avoid near by fighter
				if (threat instanceof Fighter) {
					let norm = (this.wanted_fighter_dist / distance) ** 2 - 1;
					let avoidance_v = distance_v.normalize(this.avoid_fighter_k * norm);
					target_vel.add(avoidance_v);

					avoidance_v.draw(ctx, Color.cyan, 100);
				}
				// avoid near by bullets
				else if (threat instanceof Bullet) {
					let norm = this.min_bullet_dist / (distance ** 2);
					let avoidance_v = distance_v.normalize(this.avoid_bullet_k * norm);
					target_vel.add(avoidance_v);

					avoidance_v.draw(ctx, Color.magenta, 100);
				}
			}
		});

		// avoid near by walls

		let current_aim = (object.rot - Math.PI / 2) % (2 * Math.PI); // current aim angle
		let current_direction = Vector2.fromAngle(current_aim); // current direction vector
		
		// correct to desired speed
		target_vel.draw(ctx, Color.red, 100);
		target_vel.normalize(this.target_speed);
		object.vel.draw(ctx, Color.green, 20);
		let vel_change = Vector2.dist(target_vel, object.vel);
		vel_change.draw(ctx, Color.yellow, 10);

		// thrust if we are pointing in the direction we want to go
		let thrust = vel_change.scalar(current_direction);
		thrust += this.min_thrust;
		// rotate to go where we want
		let rotation = (vel_change.angle() - current_aim) * this.direction_importance;

		// rotate to put target in center
		// improvement: estimate bullet travel time, aim accordingely, with target current speed
		if (this.focused) {
			let target = Vector2.dist(this.focused.pos, object.pos).angle();
			this.control_cannon(object, target, current_aim);
			// Vector2.fromAngle(target).draw(ctx, Color.cyan, 40);
			rotation += (target - current_aim) * this.aim_importance;
		}

		// scale rotation force
		rotation *= this.rotation_sensibility;

		object.command_thrust(thrust);
		object.command_rotation(rotation);
	}

	control(object) {
		let near_by_objects = this.get_near_by_objects(object);
		this.manage_focus(object, near_by_objects);

		let ctx = get_context(); // Debug drawing context
		ctx.translate(object.pos.x, object.pos.y);
		ctx.lineWidth = 2;

		this.manage_direction(object, near_by_objects);

		ctx.restore();
	}
}