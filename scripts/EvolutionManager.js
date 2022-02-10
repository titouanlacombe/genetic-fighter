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
	 * TODO: at the end of each generation save this object to saves folder
	 * TODO: set key shortcut to download last saved generation
	 * Stringify this & make user download it
	 */
	download_generation() {
		create_download("generation.json", JSON.stringify(this));
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
	 * Generate new population with previouses fitnesses
	 */
	trigger_new_generation() {
		// New population
		let tmp = [];

		let max_fitness = 0;
		let total_fitness = 0;
		let best = null;
		for (let fighter of this.population) {
			// Hack: store fitness in fighter for now
			fighter.fitness = this.fitness_func(fighter)
			total_fitness += fighter.fitness;

			// Find max
			if (fighter.fitness > max_fitness) {
				max_fitness = fighter.fitness;
				best = fighter;
			}
		}

		// Keep best in new generation
		tmp.push(best);

		// The better the fitness the better the chance to go in new generation
		while (tmp.length < this.population_size) {
			// Pick new from population
		}

		this.population = tmp;
	}
}