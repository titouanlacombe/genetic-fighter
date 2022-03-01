/**
 * @interface
 */
class ParentsChildCreationStrategy extends ChildCreationStrategyInterface
{
	constructor(dna_merge_strategy) {
		super();

		this.dna_merge_strategy = dna_merge_strategy;
	}

	/**
	 */
	choice(array, score_attibute = "score") {
		// Calculate total score in array
		let total_score = 0;
		for (let object of array) {
			total_score += object[score_attibute];
		}

		// Choosing element weighted by score
		let random_score = Math.random() * total_score;
		let running_score = 0;

		for (let object of array) {
			running_score += object[score_attibute];

			if (running_score > random_score) {
				return object;
			}
		}

		console.log("Warning: choice couldn't find a score better than " + random_score + " in:");
		console.log(array);
		
		return null;
	}

    /**
     * 
     * @param {Array} old_population 
     */
    create_child(old_population) {
		let parent1 = this.choice(old_population, "normalized_fitness");
		let parent2 = this.choice(old_population, "normalized_fitness");

		return this.dna_merge_strategy.merge_dnas([parent1, parent2]);
    }
}
