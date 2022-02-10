class EvolveApp extends Game {
    constructor() {
        super();
    }

    initing() {
        console.log("Initialization");
        this.evolve = new EvolutionManager();
        this.objects = [];

        this.evolve.generate();
    }

    update() {
        super.update();
    }

    exit() {
        // super.exit();
    }
}