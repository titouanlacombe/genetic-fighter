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
		this.aim_importance = 0;
		this.target_speed = 2;
		this.avoid_fighter_k = 0.01;
		this.wanted_fighter_dist = 300;
		this.avoid_bullet_k = 0.3;

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

	get_near_by_objects(object, objects) {
		let near = [];
		objects.forEach(object2 => {
			if (object != object2 &&
				Vector2.dist(object.pos, object2.pos).norm() < AIController.vision_range) {
				near.push(object2);
			}
		});
		return near;
	}

	control(object, dt, objects) {
		let near_by_objects = this.get_near_by_objects(object, objects);

		// Manage focus
		if (this.focused) {
			// Change focus if => too far or dead
			if (!this.focused.alive ||
				Vector2.dist(this.focused.pos, object.pos).norm() > this.loose_focus_dist) {
				this.focused = null;
			}
		}

		if (!this.focused) {
			this.change_focus(object, near_by_objects);

			// If can't find target: exit
			if (!this.focused) {
				// console.log("change_focus failed", object);
				return;
			}
		}

		let ctx = object.apply_transform_ctx(get_context()); // Debug drawing context
		ctx.strokeStyle = Color.red;
		ctx.lineWidth = 3;

		// vector representing the direction & speed we want to go
		let target_vel = new Vector2();

		near_by_objects.forEach(threat => {
			let distance_v = Vector2.dist(threat.pos, object.pos);
			let distance = distance_v.norm();

			if (distance != 0) {
				// avoid near by fighter
				if (threat instanceof Fighter) {
					let norm = this.wanted_fighter_dist - distance;
					norm *= 1 / distance;
					target_vel.add(distance_v.normalize(this.avoid_fighter_k * norm));
				}
				// avoid near by bullets
				else if (threat instanceof Bullet) {
					target_vel.add(distance_v.normalize(this.avoid_bullet_k * (1 / distance)));
				}
			}
		});

		// avoid near by walls

		let current_aim = (object.rot - Math.PI / 2) % (2 * Math.PI); // current aim angle
		let current_direction = Vector2.fromAngle(current_aim); // current direction vector
		
		// correct to desired speed
		target_vel.normalize(this.target_speed);
		target_vel.clone().mul(10).draw(ctx);
		let vel_change = Vector2.dist(object.vel, target_vel);

		// thrust if we are pointing in the direction we want to go
		let thrust = vel_change.scalar(current_direction);
		// rotate to go where we want
		let rotation = (vel_change.angle() - current_aim) * this.direction_importance;

		// rotate to put target in center
		// improvement: estimate bullet travel time, aim accordingely, with target current speed
		let target = Vector2.dist(this.focused.pos, object.pos).angle();
		rotation += (target - current_aim) * this.aim_importance;

		// scale rotation force
		rotation *= this.rotation_sensibility;

		object.command_thrust(thrust, dt);
		object.command_rotation(rotation);

		// fire if current aim close enough to targeted aim && cooldown passed
		if (this.cannon_cooldown < 0 &&
			Math.abs(target - current_aim) < this.min_fire_error) {
			// Try to fire
			if (object.fire(dt, objects)) {
				// If success reset cooldown
				this.cannon_cooldown = this.cannon_fire_cooldown;
			}
		} else {
			this.cannon_cooldown -= dt;
		}

		ctx.restore();
	}
}