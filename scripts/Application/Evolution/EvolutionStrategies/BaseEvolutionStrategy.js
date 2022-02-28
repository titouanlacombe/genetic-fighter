/**
 * Interface Population Evolver Strategy Strategyused to generate new population at evolution
 * @extends EvolutionStrategyInterface
 */
class BaseEvolutionStrategy extends EvolutionStrategyInterface
{
	constructor(dna_mutation_strategy, child_creation_strategy, random_fraction, keep_best) {
		super();
		this.dna_mutation_strategy = dna_mutation_strategy;
		this.child_creation_strategy = child_creation_strategy;
		this.random_fraction = random_fraction;
		this.keep_best = keep_best;
	}

	/**
	 * 
	 * @param {Array} old_population 
	 */
	generate_new_population(old_population) {
		let new_population = [];

		// Set a fraction of the population to random dna to prevent local maximas
		while (new_population.length < old_population.length * this.random_fraction) {
			new_population.push(DNA.random());
		}

		if (this.keep_best) {
			// Copy best dna into new generation
			let best_dna = old_population[0];
			for (const dna of old_population) {
				if (dna.fitness > best_dna.fitness) {
					best_dna = dna;
				}
			}
			new_population.push(best_dna);
		}

		// Building fitness array
		let choice_array = [];
		let running_fitness = 0;
		for (let dna of old_population) {
			running_fitness += dna.fitness;

			choice_array.push({
				"score": running_fitness,
				"object": dna
			});
		}

		// Fills the rest with childs
		while (new_population.length < EvolutionManager.population_size) {

			let child_dna = this.child_creation_strategy.create_child(choice_array);

			this.dna_mutation_strategy.mutate_dna(child_dna);

			new_population.push(child_dna);
		}

		return new_population;
	}
}
