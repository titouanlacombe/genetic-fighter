/**
 * Manage evolution of agents
 */
class EvolutionManager {
	/** Number of childs at the beginning of each generation */
	static population_size = 10;

	/**
	 * @constructor
	 */
	constructor() {
		// Current generation number
		this.generation = 0;
		this.population = [];
	}

	/**
	 * Stringify this object & make user download
	 */
	save_generation() {
		create_download(`generation-${this.generation}.json`, JSON.stringify(this));
	}

	/**
	 * TODO: load generation if there is data in save
	 * Load json data to create Evolution manager
	 * @param {String} data json data
	 * @returns {EvolutionManager}
	 */
	static load_generation(data) {
		return JSON.parse(data);
	}

	/**
	 * Calculate the fitness of a fighter
	 * @param {Fighter} object 
	 */
	fitness_func(object) {
		return 1;
	}

	/**
	 * Choose a random object in a weighted array
	 * Score need to be croissant & be between 0 & 1
	 * @param {Array} wheighted_array array of object with a score & an object
	 * @returns 
	 */
	choice(wheighted_array) {
		let score = Math.random();
		for (let object of wheighted_array) {
			if (object.score > score) {
				return object.object;
			}
		}
		console.log("Warning: choice couldn't find better score: " + score);
		return null;
	}

	/**
	 * Return the DNA of the controller of the fighter
	 * @param {Fighter} fighter 
	 * @returns {DNA}
	 */
	get_dna(fighter) {
		return fighter.controller.dna;
	}

	/**
	 * Create a new fighter at a random position with AIController and dna
	 * @param {DNA} dna 
	 * @returns {Fighter}
	 */
	fighter_dna_factory(dna) {
		return new Fighter(undefined, undefined, Color.white, new AIController(dna));
	}

	/**
	 * Generate new population with previouses fitnesses
	 */
	generate_new_generation() {
		// Computing fitness & stats
		let max_fitness = 0;
		let total_fitness = 0;
		let best = null;
		for (let fighter of this.population) {
			// Hack: store fitness in fighter for now
			fighter.fitness = this.fitness_func(fighter);
			total_fitness += fighter.fitness;

			// Find max
			if (fighter.fitness > max_fitness) {
				max_fitness = fighter.fitness;
				best = fighter;
			}
		}

		// --- Choosing new generation ---
		// New population
		let new_population = [];
		// Keep best in new generation
		new_population.push(best);

		// Building choice array
		// Normalizing fitnesses
		for (let fighter of this.population) {
			fighter.fitness /= total_fitness;
		}
		let choice_array = [];
		let running_fitness = 0;
		for (let fighter of this.population) {
			running_fitness += fighter.fitness;

			choice_array.push({
				"score": running_fitness,
				"object": fighter
			});
		}

		// The better the fitness the better the chance to go in new generation
		while (new_population.length < this.population_size) {
			let parent1 = this.get_dna(this.choice(choice_array));
			let parent2 = this.get_dna(this.choice(choice_array));

			let child_dna = DNA.merge(parent1, parent2);

			new_population.push(this.fighter_dna_factory(child_dna));
		}

		this.population = new_population;
	}

	/**
	 * Save old generation
	 * Generate new one
	 */
	evolve() {
		this.save_generation();

		this.generate_new_generation();
	}
}