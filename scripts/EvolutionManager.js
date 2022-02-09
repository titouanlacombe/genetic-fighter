class EvolutionManager
{

    constructor(mut_k, size)
    {

        this.population;
        this.pool;
        this.generations = 0;
        this.done = false;

        this.mutation_rate = mut_k;

        this.population = [];

        this.pool = [];
        this.calculate_fitness();

        framework.start(new Game(size));
        console.log(this.population);
    }

    calculate_fitness()
    {

        for (let i = 0; i < this.population.length; i++) {
            this.population[i].controller.calculate_fitness();
        }

    }

    natural_selection()
    {
        // reset le pool
        this.pool = [];

        let best_fitness = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].controller.fitness > best_fitness) {
                best_fitness = this.population[i].controller.fitness;
            }
        }

        // we want more of the objects with good fitness values
        for (let i = 0; i < this.population.length; i++) {
            let repeat = Math.floor(map_value(this.population[i].controller.fitness, 0, best_fitness, 0, 100));
            for (let j = 0; j < repeat; j++) {
                this.pool.push(population[i]);
            }

        }

    }

    // new generation
    generate()
    {

        for (let i = 0; i < this.population.length; i++) {
            let a = Math.floor(Math.random() * this.pool.length);
            let b = Math.floor(Math.random() * this.pool.length);
            let partnerA = this.pool[a];
            let partnerB = this.pool[b];
            // crossover
            let child = partnerA.crossover(partnerB);
            // mutate
            child.mutate(this.mutationRate);
            this.population[i].controller = child;
        }
        this.generations++;

        framework.start(new Game());
        console.log("New game");

    }

    find_best()
    {
        let best = 0;
        let index = 0;

        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].controller.fitness > best) {
                index = i;
                best = this.population[i].controller.fitness;
            }
        }
        return best;
    }

    // getters

    get_best()
    {
        return this.find_best();
    }

    get_generation()
    {
        return this.generations;
    }
}

evolve = new EvolutionManager(0.1, 1);