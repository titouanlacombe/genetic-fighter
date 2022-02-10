/**
 * Application to manage initialization and 
 * evolution of the game and the population
 * @extends Application
 */
class EvolveApp extends Application {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.evolver = new EvolutionManager();
        this.game = new Game();
    }

    /**
     * Spawns objets (AI)
     */
    initing() {
        this.game.objects = [];

        if (!this.evolver.population.length) {
            this.evolver.generate_random_pop();
        } else {
            this.evolver.load_generation("");
        }

        this.game.objects.push(...this.evolver.population);
    }

    update() {
        this.game.update();

        if (!this.game.running) {
            // TODO: generate new pop & reset game
            this.running = false;
        }
    }

    /**
     * Exit when the is a winner or all objects are dead
     */
    exiting() {
        this.game.exiting();
    }
}