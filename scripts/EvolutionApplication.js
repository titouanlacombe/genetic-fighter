/**
 * Application to manage initialization and 
 * evolution of the game and the population
 * @extends Application
 */
class EvolutionApplication extends Application {
	/** If activated, proccess 1 generation per frame instead of 1 game update per frame */
	static compute_mode = true;

	/**
	 * @constructor
	 */
	constructor() {
		super();
		this.game = new GameApplication();
		this.evolver = null;
		this.average_fitnesses = [];
		this.best_fitnesses = [];
		this.best_dnas = [];
	}

	/**
	 * Spawns objets (AI)
	 */
	initing() {
		this.running = true;

		if (/* TODO implement save loading */ true) {
			this.evolver = new EvolutionManager();
			this.evolver.generate_random_pop(this.game);
		} else {
			this.evolver = EvolutionManager.load_generation("");
		}

		this.game.initing(this.evolver.population.slice());
	}

	draw_graph(renderer, list, color) {
		// Precondition
		if (list.length < 2) {
			return;
		}

		// list min/max
		let min_val = Math.min(...list);
		let max_val = Math.max(...list);

		// Renderer config
		renderer.lineWidth = 2;
		renderer.strokeStyle = color.toString();
		renderer.beginPath();

		// First point
		let x = 0;
		let y = map_value(list[0], min_val, max_val, 0, framework.height);
		renderer.moveTo(x, y);

		// Rest of the points
		for (let i = 1; i < list.length; i++) {

			x = map_value(i, 0, list.length, 0, framework.width);
			y = map_value(list[i], min_val, max_val, 0, framework.height);
			renderer.lineTo(x, y);
		}

		renderer.stroke();
	}

	draw_results() {
		let renderer = framework.get_renderer();

		// Clear canvas
		renderer.fillStyle = "black";
		renderer.fillRect(0, 0, framework.width, framework.height);

		// Draw graphs
		this.draw_graph(renderer, this.average_fitnesses, Color.blue);
		this.draw_graph(renderer, this.best_fitnesses, Color.red);
	}

	evolve() {
		// Generate new pop
		let gen_stats = this.evolver.evolve(this.game);

		// Log stats
		console.log("Generation: " + gen_stats.generation);
		console.log("Average: " + gen_stats.average_fitness);
		console.log("Best: " + gen_stats.best_fitness, gen_stats.best_dna);

		// Update progress trackers
		this.average_fitnesses.push(gen_stats.average_fitness);
		this.best_fitnesses.push(gen_stats.best_fitness);
		this.best_dnas.push(gen_stats.best_dna);

		// Draw progress graphs
		this.draw_results();
	}

	update() {
		if (EvolutionApplication.compute_mode) {
			// Wait until the game finishes
			while (this.game.running) {
				this.game.update();
			}
		}
		else {
			this.game.update();
		}

		// If game finished
		if (!this.game.running) {
			// Reset game
			this.game.exiting();

			// Evolve & draw stats graphs
			this.evolve();

			// Init game with a copy of new pop
			this.game.initing(this.evolver.population.slice());
		}
	}

	/**
	 * Exit when the is a winner or all objects are dead
	 */
	exiting() {
		this.game.exiting();

		// TODO Download save

		this.evolver = null;
	}
}