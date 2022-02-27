/**
 * Application to manage initialization and 
 * evolution of the game and the population
 * @extends Application
 */
class EvolutionApplication extends Application {
	/** If activated, proccess 1 generation per frame instead of 1 game update per frame */
	static compute_mode = false;

	/**
	 * @constructor
	 */
	constructor() {
		super();
		this.game = new GameApplication();
		this.evolver = null;

		framework.link_event('keydown', (e) => {
			// Load
			if (e.code == "KeyL") {

				request_files((files) => {

					if (files.length != 1) {
						console.log("Error: only one file needs to be selected");
						return;
					}

					read_file(files[0], (contents) => {
						// Reinit app with data
						framework.app.initing(contents);
					});

				}, ".json");
			}
			// Save
			else if (e.code == "KeyS") {
				this.save();
			}
			// Swap mode
			else if (e.code == "Numpad0") {
				EvolutionApplication.compute_mode = !EvolutionApplication.compute_mode;
				this.game.do_draw = !EvolutionApplication.compute_mode;
			}
		});
	}

	save() {
		create_download(
			`[Genetic Fighters] Generation-${this.evolver.generations}.json`,
			JSON.stringify(this.evolver)
		);
	}

	load(data) {
		let json_evolver = JSON.parse(data);

		this.evolver = new EvolutionManager();

		for (let attribute in this.evolver) {
			this.evolver[attribute] = json_evolver[attribute];
		}
	}

	// Init game with fighters created from dna population
	init_game() {
		let fighters = [];
		for (const dna of this.evolver.population) {
			fighters.push(this.game.fighter_factory(undefined, undefined, Color.white, new AIController(dna)));
		}

		this.fighters_copy = fighters.slice();

		this.game.initing(fighters);
	}

	/**
	 * Spawns objets (AI)
	 */
	initing(contents) {
		this.running = true;

		this.average_fitnesses = [];
		this.best_fitnesses = [];
		this.best_dnas = [];

		if (typeof contents === "string") {
			this.load(contents);
		}
		else {
			this.evolver = new EvolutionManager();
			this.evolver.generate_random_pop(this.game);
		}

		this.init_game();
		this.game.do_draw = !EvolutionApplication.compute_mode;
	}

	draw_results() {
		let renderer = framework.get_renderer();

		// Clear canvas
		renderer.fillStyle = "black";
		renderer.fillRect(0, 0, framework.width, framework.height);

		// Draw graphs
		draw_graph(renderer, this.average_fitnesses, Color.blue, 0, 0, framework.width, framework.height);
		draw_graph(renderer, this.best_fitnesses, Color.red, 0, 0, framework.width, framework.height);
	}

	evolve() {
		// Calculate fitnesses
		for (const fighter of this.fighters_copy) {
			fighter.controller.dna.fitness = this.evolver.fitness_function(fighter);
		}

		// Generate new pop
		let gen_stats = this.evolver.evolve(new PopulationEvolverParentsStrategie());

		// Log stats
		console.log("Generation: " + gen_stats.generation);
		console.log("Average: " + gen_stats.average_fitness);
		console.log("Best: " + gen_stats.max_fitness, gen_stats.best_dna);

		// Update progress trackers
		this.average_fitnesses.push(gen_stats.average_fitness);
		this.best_fitnesses.push(gen_stats.max_fitness);
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

			this.init_game();
		}
	}

	/**
	 * Exit when the is a winner or all objects are dead
	 */
	exiting() {
		this.game.exiting();
		this.save();
		this.draw_results();
	}

	crashed() {
		this.save();
		this.draw_results();
	}
}
