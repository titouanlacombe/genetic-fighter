/**
 * @interface
 */
class BaseDNAMutationStrategy extends DNAMutationStrategyInterface
{
	constructor(mutation_chance, mutation_average, mutation_ecart_type) {
		super();
		
		/** Chance of a mutation to appear on a certain gene */
		this.mutation_chance = mutation_chance;
		/** Average amount of change brought by a mutation */
		this.mutation_average = mutation_average;
		/** Ecart type of random change brought by a mutation */
		this.mutation_ecart_type = mutation_ecart_type;
	}

	/**
	 * Mutate DNA
	 * @returns {DNA}
     */
    mutate_dna(dna) {
		for (let attribute in dna) {
			if (Math.random() < this.mutation_chance) {

				let sign = (Math.random() < 0.5) ? -1 : 1;

				let change = randval(
					this.mutation_average - this.mutation_ecart_type,
					this.mutation_average + this.mutation_ecart_type
				);

				dna[attribute] *= 1 + (change * sign);
			}
		}

		return dna;
    }
}
