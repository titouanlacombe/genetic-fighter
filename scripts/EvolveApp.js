/**
 * Application to manage initialization and 
 * evolution of the game and the population
 * @extends Game
 */
class EvolveApp extends Game {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.target_generation = 0;
        this.evolve = new EvolutionManager();
        this.target_generation = 0;
        this.generation_size;
    }

    /**
     * Spawns objets (AI)
     */
    initing() {
        console.log("Initialization");
        this.objects = [];

        console.log(this.generation_size);

        console.log("Population : ", this.evolve.population, "length -> ", this.evolve.population.length);

        if (!this.evolve.population.length) {
            console.log("Population empty", this.evolve.population);
            for (let i = 0; i < this.generation_size; i++) {
                let f = new Fighter();
                f.controller = new AIController(DNA.random());
                this.evolve.population.push(f);
                this.objects.push(f);
            }
        }


        // console.log(this.objects);
    }

    /**
     * Exit when the is a winner or all objects are dead
     * Then create a new generation of objects
     */
    exiting() {
        super.exiting();
        console.log(this.evolve.population);
        // this.evolve.trigger_new_generation()
        // download generation's DNA
        // start new generation if generation < target_generation
    }
}