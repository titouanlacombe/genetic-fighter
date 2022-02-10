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

	/**
	 * Merge two DNA by averaging their values
	 * @param {DNA} dna1 
	 * @param {DNA} dna2 
	 * @returns {DNA}
	 */
	static merge(dna1, dna2) {
		let dna = new this();
		for (let attribute in dna) {
			dna[attribute] = (dna1[attribute] + dna2[attribute]) / 2;
		}
		return dna;
	}

	/** Chance of a mutation to appear on a certain gene */
	static mutation_chance = 0.01;

	/** Average amount of change brought by a mutation */
	static mutation_average = 0.05;

	/** Ecart type of random change brought by a mutation */
	static mutation_ecart_type = 0.02;

	/**
	 * Mutate DNA by using class static parameters
	 */
	mutate() {
		for (let attribute in this) {
			if (Math.random() < this.mutation_chance) {
				let sign = (Math.random() < 0.5) ? -1 : 1;
				let change = randval(
					// Min
					this.mutation_average - this.mutation_ecart_type,
					// Max
					this.mutation_average + this.mutation_ecart_type
				);
				this[attribute] *= 1 + (change * sign);
			}
		}
	}
}