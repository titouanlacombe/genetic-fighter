/**
 * Application to manage initialization and 
 * evolution of the game and the population
 * @extends Application
 */
class EvolutionApplication extends Application {
	/**
	 * @constructor
	 */
	constructor() {
		super();
		this.game = new GameApplication();
		this.evolver = null;
	}

	/**
	 * Spawns objets (AI)
	 */
	initing() {
		this.running = true;

		if (/* No save found */ true) {
			this.evolver = new EvolutionManager();
			this.evolver.generate_random_pop(this.game);
		} else {
			this.evolver = EvolutionManager.load_generation("");
		}

		this.game.initing(this.evolver.population.slice());
	}

	update() {
		// Heavy computing version
		// while (this.game.running) {
		// 	this.game.update();
		// }

		this.game.update();

		// If game finished
		if (!this.game.running) {
			// Generate new pop
			this.evolver.evolve(this.game);

			// Reset game
			this.game.exiting();
			// Init game with a copy of new pop
			this.game.initing(this.evolver.population.slice());
		}
	}

	/**
	 * Exit when the is a winner or all objects are dead
	 */
	exiting() {
		this.game.exiting();
		this.evolver = null;
	}
}