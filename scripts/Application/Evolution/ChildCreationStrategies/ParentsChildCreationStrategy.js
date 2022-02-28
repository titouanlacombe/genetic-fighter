/**
 * @interface
 */
class ParentsChildCreationStrategy extends ChildCreationStrategyInterface
{
	/**
	 * Merge two DNA by averaging their values
	 * @param {DNA} dna1 
	 * @param {DNA} dna2 
	 * @returns {DNA}
	 */
	merge(dna1, dna2) {
		let dna = new DNA();
		for (let attribute in dna) {
			dna[attribute] = (dna1[attribute] + dna2[attribute]) / 2;
		}
		return dna;
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
     * 
     * @param {Array} old_population 
     */
    create_child(choice_array) {
		let parent1 = this.choice(choice_array);
		let parent2 = this.choice(choice_array);

		return this.merge(parent1, parent2);
    }
}
