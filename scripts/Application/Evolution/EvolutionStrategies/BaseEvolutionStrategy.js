/**
 * Interface Population Evolver Strategy Strategyused to generate new population at evolution
 * @extends EvolutionStrategyInterface
 */
class BaseEvolutionStrategy extends EvolutionStrategyInterface
{
	constructor(parent_selection_strategy, dna_merge_strategy, dna_mutation_strategy, random_fraction, keep_best) {
		super();

		this.parent_selection_strategy = parent_selection_strategy;
		this.dna_merge_strategy = dna_merge_strategy;
		this.dna_mutation_strategy = dna_mutation_strategy;
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

		// Fills the rest with childs
		while (new_population.length < EvolutionManager.population_size) {

			// Select parents
			let parents = this.parent_selection_strategy.select_parents(old_population);
			// Merge parent's dnas to create the child's dna
			let child_dna = this.dna_merge_strategy.merge_dnas(parents);
			// Mutate child's dna
			this.dna_mutation_strategy.mutate_dna(child_dna);

			new_population.push(child_dna);
		}

		return new_population;
	}
}
