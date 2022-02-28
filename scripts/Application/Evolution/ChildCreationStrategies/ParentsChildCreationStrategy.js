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

		return this.dna_merge_strategy.merge_dnas([parent1, parent2]);
    }
}
