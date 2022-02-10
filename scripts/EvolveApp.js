/**
 * Application to manage initialization and 
 * evolution of the game and the population
 * @extends Game
 */
class EvolveApp extends Game {
    /**
     * @constructor
     */
    constructor(target_generation) {
        super();
        this.evolve = new EvolutionManager(0.1, 5);
        this.target_generation = target_generation;
    }

    /**
     * Spawns objets (AI)
     */
    initing() {
        console.log("Initialization");
        this.objects = [];

        console.log(this.evolve.size);

        for (let i = 0; i < this.evolve.size; i++) {
            let f = new Fighter();
            f.controller = new AIController(DNA.random());
            this.objects.push(f);
        }

        // console.log(this.objects);
    }

    // update() {
    //     super.update();
    // }


    /**
     * Exit when the is a winner or all objects are dead
     * Then create a new generation of objects
     */
    exiting() {
        super.exiting();
        // download generation's DNA
        // start new generation if generation < target_generation
    }
}