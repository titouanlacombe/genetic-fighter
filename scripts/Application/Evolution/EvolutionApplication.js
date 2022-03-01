/**
 * Application to manage initialization and 
 * evolution of the game and the population
 * @extends Application
 */
class EvolutionApplication extends Application {
	/** If activated, proccess 1 generation per frame instead of 1 game update per frame */
	static compute_mode = false;
	static progress_tracker_max_length = 1000;

	/**
	 * @constructor
	 */
	constructor() {
		super();

		this.game = new GameApplication(new OnlyFighterLeftStrategy());
		this.evolver = null;

		// Add app key shortcuts
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

		this.progress_tracker = [];

		this.evolver = new EvolutionManager(
			new BaseEvolutionStrategy(
				new ProportionalChanceParentSelectionStrategy(2),
				new AverageDNAMergeStrategy(),
				new BaseDNAMutationStrategy(0.1, 0.05, 0.03),
				1 / 6,
				true
			)
		);

		if (typeof contents === "string") {
			// Load save
			this.load(contents);
		}
		else {
			// Generate random start population
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
		// Average fitness
		draw_graph(renderer, this.progress_tracker.map((el) => {
			return el.average_fitness;
		}), Color.blue, 0, 0, framework.width, framework.height);

		// Best fitness
		draw_graph(renderer, this.progress_tracker.map((el) => {
			return el.max_fitness;
		}), Color.red, 0, 0, framework.width, framework.height);
	}

	evolve() {
		// Calculate fitnesses
		for (const fighter of this.fighters_copy) {
			fighter.controller.dna.fitness = this.evolver.fitness_function(fighter);
		}
		
		// Bonus to winner
		if (this.game.winner instanceof Fighter) {
			this.game.winner.controller.dna.fitness += 50;
		}

		// Generate new pop
		let gen_stats = this.evolver.evolve();

		// Log results
		console.log("Generation: " + gen_stats.generation);
		console.log("Average: " + gen_stats.average_fitness);
		console.log("Best: " + gen_stats.max_fitness);

		// Update progress trackers
		this.progress_tracker.push(gen_stats);

		if (this.progress_tracker.length > EvolutionApplication.progress_tracker_max_length ?? false) {
			this.progress_tracker.shift();
		}
	}

	update() {
		if (EvolutionApplication.compute_mode) {
			// Wait until the game finishes
			while (this.game.running) {
				this.game.update();
			}
		}
		else {
			// Single update per frame
			this.game.update();
		}

		// If game finished
		if (!this.game.running) {
			// Reset game
			this.game.exiting();

			// Evolve & draw stats graphs
			this.evolve();

			// Draw progress graphs
			this.draw_results();
			
			// Restart game
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
