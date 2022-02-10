/**
 * Manage evolution of agents
 */
class EvolutionManager {
	/** Number of childs at the beginning of each generation */
	static population_size = 3;

	/**
	 * @constructor
	 */
	constructor() {
		// Current generation number
		this.generation = null;
		this.population = null;
	}

	/**
	 * Create a new fighter at a random position with AIController and dna
	 * @param {GameApplication} app 
	 * @param {DNA} dna 
	 * @returns {Fighter}
	 */
	fighter_dna_factory(app, dna) {
		return app.fighter_factory(undefined, undefined, Color.white, new AIController(dna));
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
	 * Generate a fully random population of length EvolutionManager.population_size
	 * @param {GameApplication} app Game application 
	 */
	generate_random_pop(app) {
		this.population = [];
		this.generation = 1;
		while (this.population.length < EvolutionManager.population_size) {
			this.population.push(this.fighter_dna_factory(app));
		}
	}

	/**
	 * Return the list of this population dnas
	 * @returns {Array}
	 */
	get_dnas() {
		// Recover dnas
		let dnas = [];
		for (let fighter of this.population) {
			dnas.push(this.get_dna(fighter));
		}
		return dnas;
	}

	/**
	 * Stringify this object & make user download
	 */
	save_generation() {
		// Recover dnas
		let dnas = this.get_dnas();

		// Create JSON
		let json = JSON.stringify({
			"gen": this.generation,
			"dnas": dnas,
		});

		// Create download
		create_download(`generation-${this.generation}.json`, json);
	}

	/**
	 * Load json data to create Evolution manager
	 * @param {String} data json data
	 * @returns {EvolutionManager}
	 */
	static load_generation(data) {
		// return JSON.parse(data);
	}

	/**
	 * Choose a random object in a weighted array
	 * Score need to be croissant & be between 0 & 1
	 * @param {Array} wheighted_array array of object with a score & an object
	 * @returns {Object | null}
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
	 * Calculate the fitness of a fighter
	 * @param {Fighter} object 
	 */
	fitness_func(object) {
		return 1;
	}

	/**
	 * Generate new population with previouses fitnesses
	 * @param {GameApplication} app Game application
	 */
	generate_new_generation(app) {
		let dnas = this.get_dnas();

		// Computing fitness & stats
		let max_fitness = 0;
		let total_fitness = 0;
		let best = null;
		for (let dna of dnas) {
			// Hack: store fitness in dna for now
			dna.fitness = this.fitness_func(dna);
			total_fitness += dna.fitness;

			// Find max
			if (dna.fitness > max_fitness) {
				max_fitness = dna.fitness;
				best = dna;
			}
		}

		// --- Choosing new generation ---
		// New population
		let new_population = [];
		// Keep best in new generation
		new_population.push(this.fighter_dna_factory(app, best));

		// Building choice array
		// Normalizing fitnesses
		for (let dna of dnas) {
			dna.fitness /= total_fitness;
		}
		let choice_array = [];
		let running_fitness = 0;
		for (let dna of dnas) {
			running_fitness += dna.fitness;

			choice_array.push({
				"score": running_fitness,
				"object": dna
			});
		}

		// The better the fitness the better the chance to go in new generation
		while (new_population.length < EvolutionManager.population_size) {
			let parent1 = this.choice(choice_array);
			let parent2 = this.choice(choice_array);

			let child_dna = DNA.merge(parent1, parent2);
			child_dna.mutate();

			new_population.push(this.fighter_dna_factory(app, child_dna));
		}

		this.population = new_population;
	}

	/**
	 * Save old generation
	 * Generate new one
	 * @param {GameApplication} app Game application
	 */
	evolve(app) {
		// this.save_generation();

		this.generate_new_generation(app);

		this.generation++;
	}
}