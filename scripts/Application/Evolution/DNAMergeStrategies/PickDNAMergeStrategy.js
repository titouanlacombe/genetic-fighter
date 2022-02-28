/**
 */
 class PickDNAMergeStrategy extends DNAMergeStrategyInterface {
	/**
	 * @returns {DNA}
     */
    merge_dnas(dnas) {
		let dna = new DNA();
		for (let attribute in dna) {
			// Pick one gene from a parent
			dna[attribute] = pick_random(dnas)[attribute];
		}
		return dna;
    }
}
