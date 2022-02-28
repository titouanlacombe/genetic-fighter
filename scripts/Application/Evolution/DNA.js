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
		dna.min_fighter_dist = randval(0, 200);
		dna.max_fighter_dist = randval(dna.min_fighter_dist, 500);
		dna.wanted_target_dist = randval(dna.min_fighter_dist, dna.max_fighter_dist);
		dna.min_fire_error = randval(0, 2 * Math.PI);
		dna.encounter_time_max = randval(0, 60);
		dna.encounter_dist_max = randval();
		dna.positionning_K = randval();
		dna.searching_K = randval();
		dna.wall_K = randval();
		dna.min_thrust = randval(0, 10);
		dna.angle_Kp = 20;
		dna.angle_Ki = 0;
		dna.angle_Kd = 0;
		dna.vel_Kp = 20;
		dna.vel_Ki = 0;
		dna.vel_Kd = 0;
		return dna;
	}
}