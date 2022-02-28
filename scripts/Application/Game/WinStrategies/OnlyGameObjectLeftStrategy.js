/**
 * 
 * @interface
 */
class OnlyGameObjectLeftStrategy {
	/**
	 * 
	 * @param {Array} game_objects 
	 */
	get_winner(game_objects) {
		if (game_objects.length == 1) {
			return game_objects[0];
		}

		if (game_objects.length == 0) {
			return false;
		}

		return null;
	}
}
