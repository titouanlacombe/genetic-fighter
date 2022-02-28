/**
 */
 class AverageDNAMergeStrategy extends DNAMergeStrategyInterface {
	/**
	 * @returns {DNA}
     */
    merge_dnas(dnas) {
		let dna = new DNA();
		for (let attribute in dna) {
			// Averages between parents
			dna[attribute] = 0;
			for (let parent of dnas) {
				dna[attribute] += parent[attribute];
			}
			dna[attribute] /= dnas.length;
		}

		if (dna.isNaN()) {
			throw new Error("DNA NaN after merge");
		}

		return dna;
    }
}
