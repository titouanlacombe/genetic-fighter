class Game
{
	constructor()
	{
		this.objects = []; // Objects in the simulation
		this.winner = null;

		this.sim_dt = 0; // Delta time between last 2 sim steps
		this.sim_time = 0; // Time since the start of the simulation
		this.fixed_dt = 0.3; // fix delta time to a constant (debug tool)
	}

	static player_factory(x, y, color, controller)
	{
		let player = new Fighter(x, y, color, controller);

		// User input linking
		framework.link_event('keydown', (e) =>
		{
			controller.input(e.code, true);
		});

		framework.link_event('keyup', (e) =>
		{
			controller.input(e.code, false);
		});

		return player;
	}

	// Initialize game
	initing()
	{
		this.objects = []; // Objects in the simulation

		// Spawns AIs
		for (let i = 0; i < 3; i++) {
			let f = new Fighter();
			f.controller = new AIController();
			this.objects.push(f);
		}

		// Spawns Players
		// this.objects.push(this.player_factory(100, framework.height / 2, Color.fromHex("#9a39a3"), new Player1Controller()));
		// this.objects.push(this.player_factory(framework.width - 100, framework.height / 2, Color.fromHex("#4287f5"), new Player2Controller()));
	}

	exiting()
	{
		this.draw();

		if (this.winner) {
			console.log("Winner: ", this.winner);
		}
		else {
			console.log("No winner");
		}
	}

	// Draw new frame
	draw()
	{
		// Clear canvas
		let renderer = framework.get_renderer();
		renderer.fillStyle = "black";
		renderer.fillRect(0, 0, framework.width, framework.height);

		// Draw objects
		for (let object of this.objects) {
			object.draw_wrapper(renderer);
		}
	}

	update()
	{
		// Update time variables
		// 1/16 is a correction so that this.sim_dt is close to 1 when 60 fps
		this.sim_dt = this.fixed_dt ?? framework.dt * 1 / 16;
		this.sim_time += this.sim_dt;

		// Draw the objects
		this.draw();

		// Move the objects
		for (let object of this.objects) {
			object.euler();
		}

		CollisionManager.update_distances_cache(this.objects);

		// Handle collisions & out of bounds
		CollisionManager.object_to_bounds(this.objects, 0, framework.width, 0, framework.height, true);
		CollisionManager.object_to_object(this.objects);

		// Simulate the objects
		for (let object of this.objects) {
			object.simulate();
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
			framework.stop();
		}
	}

	get_winner()
	{
		let is_last_fighter = this.objects.length == 1 && this.objects[0] instanceof Fighter;

		if (is_last_fighter) {
			return this.objects[0];
		}
		else {
			return null;
		}
	}
}

framework.start(new Game());
