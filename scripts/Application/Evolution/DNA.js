/**
 * DNA class
 * Store genes of AI
 * Usefull methods to generate & mix DNA
 */
class DNA {
	/**
	 * @constructor
	 */
	constructor() {
		this.min_fighter_dist = null;
		this.max_fighter_dist = null;
		this.wanted_target_dist = null;

		this.min_fire_error = null;

		this.encounter_time_max = null;
		this.encounter_dist_max = null;

		this.positionning_K = null;
		this.searching_K = null;
		this.wall_K = null;

		this.min_thrust = null;

		// PID settings
		this.angle_Kp = null;
		this.angle_Ki = null;
		this.angle_Kd = null;

		this.vel_Kp = null;
		this.vel_Ki = null;
		this.vel_Kd = null;
	}

	/**
	 * Generate and return a random dna sample
	 * @returns {DNA}
	 */
	static random() {
		let dna = new this();
		dna.min_fighter_dist = randval(0, 500);
		dna.max_fighter_dist = randval(0, 500);
		dna.wanted_target_dist = randval(0, 500);
		dna.min_fire_error = randval(0, 2 * Math.PI);
		dna.encounter_time_max = randval(0, 60);
		dna.encounter_dist_max = randval(0, 100);
		dna.positionning_K = randval(0, 10);
		dna.searching_K = randval(0, 10);
		dna.wall_K = randval(0, 10);
		dna.min_thrust = randval(0, 10);
		dna.angle_Kp = randval(0, 20);
		dna.angle_Ki = randval(0, 10);
		dna.angle_Kd = randval(0, 10);
		dna.vel_Kp = randval(0, 20);
		dna.vel_Ki = randval(0, 10);
		dna.vel_Kd = randval(0, 10);
		return dna;
	}

	isNaN() {
		for (const attribute in this) {
			if (isNaN(this[attribute])) {
				return true;
			}
		}
		return false;
	}
}