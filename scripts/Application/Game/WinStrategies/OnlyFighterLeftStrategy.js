/**
 * 
 * @interface
 */
class OnlyFighterLeftStrategy {
	/**
	 * 
	 * @param {Array} game_objects 
	 */
	get_winner(game_objects) {
		let fighters_left = [];

		for (const object of game_objects) {
			if (object instanceof Fighter) {
				fighters_left.push(object);
			}
		}

		if (fighters_left.length == 1) {
			return fighters_left[0];
		}

		if (fighters_left.length == 0) {
			return false;
		}

		return null;
	}
}
