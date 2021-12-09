class AIController extends Controller
{
	static vision_range = 1000;

	constructor() {
		super();

		// DNA
		this.rotation_sensibility = 0.7;
		this.cannon_fire_cooldown = 3;
		this.min_fire_error = 0.1;
		this.loose_focus_dist = 500;
		this.direction_importance = 0;
		
		// Variables
		this.focused = null;
		this.cannon_cooldown = 0;
	}

	// Choose closest fighter
	// Bias via ones in front (TODO)
	change_focus(object, near_by_objects)
	{
		let min_distance = Infinity;
		near_by_objects.forEach(potential => {
			if (potential instanceof Fighter) {
				let distance = dist(object.pos, potential.pos).norm();
				if (distance < min_distance) {
					this.focused = potential;
					min_distance = distance;
				}
			}
		});
	}

	get_near_by_objects(object, objects)
	{
		let near = [];
		objects.forEach(object2 => {
			if (object != object2
				&& dist(object.pos, object2.pos).norm() < AIController.vision_range)
			{
				near.push(object2);
			}
		});
		return near;
	}

	control(object, dt, objects)
	{
		let near_by_objects = this.get_near_by_objects(object, objects);

		if (this.focused) {
			// Change focus if => too far or dead
			if (!this.focused.alive
				|| dist(this.focused.pos, object.pos).norm() > this.loose_focus_dist)
			{
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

		let thrust = 0; // wanted thrust
		let rotation = 0; // wanted aim direction
		let current_aim = (object.rot - Math.PI / 2) % (2 * Math.PI); // current aim angle
		// vector representing the direction & speed we want to go
		let target_direction = new Vector2();

		near_by_objects.forEach(object => {
			// avoid near by fighter
			
			// avoid near by bullets
			
			// avoid near by walls
		});

		// thrust if we are pointing in the direction we want to go
		thrust += target_direction.scalar(object.vel.clone().normalize());

		// rotate to go where we want
		rotation += (target_direction.angle() - current_aim) * this.direction_importance;

		// rotate to put target in center
		// improvement: estimate bullet travel time, aim accordingely, with target current speed
		rotation += dist(this.focused.pos, object.pos).angle() - current_aim;
		
		// scale rotation force
		rotation *= this.rotation_sensibility;

		// fire if current aim close enough to targeted aim && cooldown passed
		if (this.cannon_cooldown < 0
			&& Math.abs(rotation) < this.min_fire_error) {
			if (object.fire(dt, objects)) {
				this.cannon_cooldown = this.cannon_fire_cooldown;
			}
		}
		else {
			this.cannon_cooldown -= dt;
		}

		object.command_thrust(thrust, dt);
		object.command_rotation(rotation);
	}
}