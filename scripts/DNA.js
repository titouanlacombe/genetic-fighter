class DNA {
    constructor() {

        // genes 

        this.min_fighter_dist = randval(0, 200);
        this.max_fighter_dist = randval(this.min_fighter_dist, 500);
        this.wanted_target_dist = randval(this.min_fighter_dist, this.max_fighter_dist);

        this.min_fire_error = randval(0, 2 * Math.PI);

        this.encounter_time_max = randval(0, 60);
        this.encounter_dist_max = randval();

        this.positionning_K = randval();
        this.searching_K = randval();
        this.wall_K = randval();

        this.min_thrust = randval(0, 10);

        // PID settings
        this.angle_Kp = 20;
        this.angle_Ki = 0;
        this.angle_Kd = 0;

        this.vel_Kp = 20;
        this.vel_Ki = 0;
        this.vel_Kd = 0;

        // Fitness calculation
        this.fitness = 0;
        this.birth = Date.now(); // creation date
    }

    // fitness calculation
    calculate_fitness() {
        this.fitness = Date.now() - this.birth;
    }

    a_or_b() {
        let r = Math.random * 100;
        return r > 50;
    }

    crossover(partner) {
        // new child
        let child_dna = new DNA();

        for (let gene in Object.keys(this)) {
            if (a_or_b) {
                // take parent A genes
                gene = this
            }

        }

    }
}