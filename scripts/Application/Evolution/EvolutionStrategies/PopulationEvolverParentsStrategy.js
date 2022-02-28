/**
 * Interface Population Evolver Strategy Strategyused to generate new population at evolution
 * @extends PopulationEvolverStrategyInterface
 */
class PopulationEvolverParentsStrategy extends PopulationEvolverStrategyInterface {
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
	generate_new_population(old_population) {
		let new_population = [];

		// Set 1 / 6 th of the population to random dna to prevent local maximas
		while (new_population.length < EvolutionManager.population_size / 6) {
			new_population.push(DNA.random());
		}

		// Keep best in new generation
		let best_dna = old_population[0];
		for (const dna of old_population) {
			if (dna.fitness > best_dna.fitness) {
				best_dna = dna;
			}
		}
		new_population.push(best_dna);

		// Building parent choice array
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

			// The better the fitness the better the chance to go in new generation
			let parent1 = this.choice(choice_array);
			let parent2 = this.choice(choice_array);

			let child_dna = DNA.merge(parent1, parent2);
			child_dna.mutate();
			new_population.push(child_dna);
		}

		return new_population;
	}
}
