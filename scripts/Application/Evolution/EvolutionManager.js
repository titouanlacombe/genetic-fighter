/**
 * Manage evolution of agents
 */
class EvolutionManager {
	/** Number of childs at the beginning of each generation */
	static population_size = 6;

	/**
	 * @constructor
	 */
	constructor(evolution_strategy) {
		this.evolution_strategy = evolution_strategy;

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
		if (this.population.length == 0) {
			throw new Error("Empty population");
		}

		// Sorting dnas
		this.population.sort((a, b) => b.fitness - a.fitness);

		let gen_stats = {};

		// Generation number
		gen_stats.generation = this.generations;

		// Best / Median / Worst dna
		gen_stats.best_dna = this.population[0];
		gen_stats.median_dna = this.population[Math.floor(this.population.length / 2)];
		gen_stats.worst_dna = this.population[this.population.length - 1];
		
		// Calculating average fitness
		gen_stats.average_fitness = 0;
		for (const dna of this.population) {
			gen_stats.average_fitness += dna.fitness;
		}
		gen_stats.average_fitness /= this.population.length;

		return gen_stats;
	}

	generate_new_generation(gen_stats) {
		// Normalizing fitnesses (between 0 & 1)
		for (let dna of this.population) {
			dna.normalized_fitness = map_value(dna.fitness, gen_stats.best_dna.fitness, gen_stats.worst_dna.fitness);
		}

		// New population
		this.population = this.evolution_strategy.generate_new_population(this.population);

		this.generations++;
	}

	evolve() {
		let gen_stats = this.get_generation_stats();
		this.generate_new_generation(gen_stats);
		return gen_stats;
	}
}