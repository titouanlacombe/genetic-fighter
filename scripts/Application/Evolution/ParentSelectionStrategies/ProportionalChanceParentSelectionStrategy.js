/**
 * @interface
 */
class ProportionalChanceParentSelectionStrategy extends ParentSelectionStrategyInterface
{
	constructor(nb_parents) {
		super();

		this.nb_parents = nb_parents;
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
	select_parents(old_population) {
		let parents = [];

		for (let i = 0; i < this.nb_parents; i++) {
			parents.push(this.choice(old_population, "normalized_fitness"));
		}

		return parents;
    }
}
