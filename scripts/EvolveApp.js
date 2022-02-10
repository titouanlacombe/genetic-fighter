class EvolveApp extends Game {
    constructor() {
        super();
    }

    initing() {
        console.log("Initialization");
        this.evolve = new EvolutionManager(0.1, 5);
        this.objects = [];

        console.log(this.evolve.size);

        for (let i = 0; i < this.evolve.size; i++) {
            let f = new Fighter();
            f.controller = new AIController(DNA.random());
            this.objects.push(f);
        }

        console.log(this.objects);
    }

    update() {
        super.update();
    }

    exiting() {
        super.exiting();
        console.log("Winner in exit (): ", this.winner);
    }
}