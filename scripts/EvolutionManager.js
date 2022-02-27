/**
 * Manage evolution of agents
 */
class EvolutionManager {
	/** Number of childs at the beginning of each generation */
	static population_size = 4;

	/**
	 * @constructor
	 */
	constructor() {
		// Current generation number
		this.generations = 1;
		this.population = [];
	}

	/**
	 * Generate a fully random population of length EvolutionManager.population_size
	 */
	generate_random_pop() {
		this.population = [];

		while (this.population.length < EvolutionManager.population_size) {
			this.population.push(DNA.random());
		}
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
		console.log("Warning: choice couldn't find a score better than " + score + " in:");
		console.log(wheighted_array);
		return null;
	}

	/**
	 * Calculate the fitness of a fighter
	 * @param {Fighter} object 
	 * @returns {Number}
	 */
	fitness_function(object) {
		return object.time_lived;
	}

	get_generation_stats() {
		let gen_stats = {};
		gen_stats.generation = this.generations;
		gen_stats.max_fitness = -Infinity;
		gen_stats.min_fitness = Infinity;
		gen_stats.average_fitness = 0;
		gen_stats.best_dna = null;

		// --- Finding min/max fitnesses ---
		for (let dna of this.population) {
			// Hack: store fitness in dna for now
			gen_stats.average_fitness += dna.fitness;

			// Find max
			if (dna.fitness > gen_stats.max_fitness) {
				gen_stats.max_fitness = dna.fitness;
				gen_stats.best_dna = dna;
			}

			// Find min
			if (dna.fitness < gen_stats.min_fitness) {
				gen_stats.min_fitness = dna.fitness;
			}
		}
		gen_stats.average_fitness /= this.population.length;

		return gen_stats;
	}

	generate_new_generation(gen_stats) {
		// --- Normalizing fitnesses ---
		// Remaping between 0 & 1
		for (let dna of this.population) {
			dna.fitness = map_value(dna.fitness, gen_stats.min_fitness, gen_stats.max_fitness);
		}
		// Computing total amount of fitness
		let total_fitness = 0;
		for (let dna of this.population) {
			total_fitness += dna.fitness;
		}
		// Dividing each fitness by total (to have a total of 1)
		for (let dna of this.population) {
			dna.fitness /= total_fitness;
		}

		// --- Choosing new generation ---
		// Building parent choice array
		let choice_array = [];
		let running_fitness = 0;
		for (let dna of this.population) {
			running_fitness += dna.fitness;

			choice_array.push({
				"score": running_fitness,
				"object": dna
			});
		}

		// New population
		let new_population = [];

		// Keep best in new generation
		new_population.push(gen_stats.best_dna);

		// The better the fitness the better the chance to go in new generation
		while (new_population.length < EvolutionManager.population_size) {

			let parent1 = this.choice(choice_array);
			let parent2 = this.choice(choice_array);

			let child_dna = DNA.merge(parent1, parent2);
			child_dna.mutate();
			new_population.push(child_dna);
		}

		this.population = new_population;
		this.generations++;
	}

	evolve() {
		let gen_stats = this.get_generation_stats();
		this.generate_new_generation(gen_stats);
		return gen_stats;
	}
}