/**
 * Sandbox application to dev & test the game
 * @extends Application
 */
class GameApplication extends Application {
	/**
	 * @constructor
	 */
	constructor() {
		super();

		/** Objects in the simulation */
		this.objects = [];
		/** Winner of the game (last standing fighter) */
		this.winner = null;
		/** Wether to draw or not */
		this.do_draw = null;

		/** Time since the start of the simulation */
		this.sim_time = 0;
		/** Force delta time to be constant (if null use realtime) */
		this.fixed_dt = 0.4;
	}


	fighter_factory(x, y, color, controller) {
		return new Fighter(x, y, color, controller);
	}

	/**
	 * Create a player
	 * Link key events to controller
	 * @param {Number} x spawn x
	 * @param {Number} y spawn y
	 * @param {Color} color Color
	 * @param {Player1Controller} controller
	 * @returns {Fighter} New player
	 */
	player_factory(x, y, color, controller) {
		let player = this.fighter_factory(x, y, color, controller);

		// User input linking
		framework.link_event('keydown', (e) => {
			controller.input(e.code, true);
		});

		framework.link_event('keyup', (e) => {
			controller.input(e.code, false);
		});

		return player;
	}

	/**
	 * Spawn players & AIs
	 * @param {Array} objects array of initial objects
	 */
	initing(objects = []) {
		this.objects = objects;
		this.running = true;

		// If objects empty
		if (!objects.length) {
			// Spawns AIs
			for (let i = 0; i < 3; i++) {
				this.objects.push(
					this.fighter_factory(undefined, undefined, Color.white, new AIController())
				);
			}

			// Spawns Players
			this.objects.push(this.player_factory(100, framework.height / 2, Color.fromHex("#9a39a3"), new Player1Controller()));
			// this.objects.push(this.player_factory(framework.width - 100, framework.height / 2, Color.fromHex("#4287f5"), new Player2Controller()));
		}
	}

	/**
	 * Draw last frame & display winner
	 */
	exiting() {
		if (this.do_draw) {
			this.draw();
		}

		// if (this.winner) {
		// 	console.log("Winner: ", this.winner);
		// }
		// else {
		// 	console.log("No winner");
		// }
	}

	/**
	 * Draw new frame
	 */
	draw() {
		// Clear canvas
		let renderer = framework.get_renderer();
		renderer.fillStyle = "black";
		renderer.fillRect(0, 0, framework.width, framework.height);

		// Draw objects
		for (let object of this.objects) {
			object.draw_wrapper(renderer);
		}
	}

	/**
	 * Update simulation
	 * - Draw
	 * - Move the objects
	 * - Handle collision
	 * - Simulate
	 * - Delete dead
	 * - If stop condition reached stop the game
	 * @param {Number} dt delta time between steps 
	 */
	update(dt) {
		// Update time variables
		// 1/16 is a correction so that this.sim_dt is close to 1 when 60 fps
		let sim_dt = this.fixed_dt ?? dt * 1 / 16;
		this.sim_time += sim_dt;

		// Draw the objects
		if (this.do_draw) {
			this.draw();
		}

		// Move the objects
		for (let object of this.objects) {
			object.euler(sim_dt);
		}

		CollisionManager.update_distances_cache(this.objects);

		// Handle collisions & out of bounds
		CollisionManager.object_to_bounds(this.objects, 0, framework.width, 0, framework.height, true);
		CollisionManager.object_to_object(this.objects);

		// Simulate the objects
		for (let object of this.objects) {
			object.simulate(this.objects, sim_dt);
		}

		// Only keep alive objects
		let alive = [];
		for (let object of this.objects) {
			if (object.alive) {
				alive.push(object);
			}
			else {
				object.die();
			}
		}

		this.objects = alive;

		this.winner = this.get_winner();
		if (this.winner != null || this.objects.length == 0) {
			this.running = false;
		}
	}

	/**
	 * Try to get the winner
	 * null if no winner
	 */
	get_winner() {
		let is_last_fighter = this.objects.length == 1 && this.objects[0] instanceof Fighter;

		if (is_last_fighter) {
			return this.objects[0];
		}
		else {
			return null;
		}
	}
}