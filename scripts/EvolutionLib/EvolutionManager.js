/**
 * Manage evolution of agents
 */
class EvolutionManager {
	/** Number of childs at the beginning of each generation */
	static population_size = 6;

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
		for (const dna of this.population) {
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

	generate_new_generation(gen_stats, strategie) {
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
		if (total_fitness != 0) {
			// Dividing each fitness by total (to have a total of 1)
			for (let dna of this.population) {
				dna.fitness /= total_fitness;
			}
		}

		// New population
		this.population = strategie.generate_new_population(this.population);
		this.generations++;
	}

	evolve(strategie) {
		let gen_stats = this.get_generation_stats();
		this.generate_new_generation(gen_stats, strategie);
		return gen_stats;
	}
}