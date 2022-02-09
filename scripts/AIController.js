class AIController extends Controller {
    static vision_range = 500;

    constructor() {
        super();

        // DNA
        this.dna = new DNA();

        // --- non DNA ---
        // PID
        this.angle_pid = new PIDController(this.dna.angle_Kp, this.dna.angle_Ki, this.dna.angle_Kd);
        this.vel_pid = new PIDController(this.dna.vel_Kp, this.dna.vel_Ki, this.dna.vel_Kd);

        // Variables
        this.target = null;

        // Init AI states
        this.init_states();

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

    // Can't be static function because the exit condition changes depending on the AI DNA
    init_states() {
        // let suicide = new State("suicide");
        let searching = new State("searching");
        let aiming = new State("aiming");
        let fleeing = new State("fleeing");
        let positionning = new State("positionning");
        let turret = new State("turret");

        // --- "aiming" state ---
        // Switch to "positionning" if target not at good distance
        aiming.add_exit(positionning, (object) => {
            if (!this.target) {
                return false;
            }

            let d = object.dist_to(this.target);
            return d < this.dna.min_fighter_dist || d > this.dna.max_fighter_dist;
        });

        // Switch to "searching" if has no target
        aiming.add_exit(searching, (object) => {
            return this.target == null;
        });

        // Switch to "turret" if has no fuel
        aiming.add_exit(turret, (object) => {
            return object.fuel <= 0;
        });

        // Switch to "fleeing" if has no munitions
        aiming.add_exit(fleeing, (object) => {
            return object.munitions <= 0;
        });

        // --- "positionning" state ---
        // Switch to "aiming" if target is in range
        positionning.add_exit(aiming, (object) => {
            if (!this.target) {
                return false;
            }
            let d = this.target.dist_to(object);
            return d < this.dna.max_fighter_dist && d > (this.dna.min_fighter_dist + 50);
        });

        //	Switch to "searching" if has no target
        positionning.add_exit(searching, (object) => {
            return this.target == null;
        });

        // Switch to "turret" if has no fuel
        positionning.add_exit(turret, (object) => {
            return object.fuel <= 0;
        });

        // Switch to "fleeing" if has no munitions
        positionning.add_exit(fleeing, (object) => {
            return object.munitions <= 0;
        });

        // --- "searching" state ---
        // Switch to "positionning" when finds a target
        searching.add_exit(positionning, (object) => {
            return this.target != null;
        });

        this.state = searching;
    }

    get_angle(object) {
        return object.angle - Math.PI / 2;
    }

    // Choose closest fighter
    // Bias via ones in front (TODO)
    find_target(object, near_by_objects) {
        let min_distance = Infinity;
        for (let potential of near_by_objects) {
            if (potential instanceof Fighter) {
                let distance = object.dist_to(potential);
                if (distance < min_distance) {
                    this.target = potential;
                    min_distance = distance;
                }
            }
        }
    }

    manage_target(object, near_by_objects) {
        // Loose target if => too far or dead
        if (this.target) {
            if (!this.target.alive ||
                this.target.dist_to(object) > this.dna.max_fighter_dist) {
                this.target = null;
            }
        }

        // If no target try to find new target
        if (!this.target) {
            this.find_target(object, near_by_objects);
        }
    }

    get_firering_angle(object) {
        let renderer = framework.get_renderer();

        let result = TrajectoryPredictor.get_firering_angle(object, this.target, Fighter.fire_vel);

        if (result != null) {
            let target_pos = this.target.pos.clone().add(this.target.vel.clone().mul(result.dt));

            // Draw angle
            Vector2.fromAngle(result.angle).draw(Color.red, 30);

            // console.log(target_pos);
            // console.log(result.dt);
            // console.log(result.angle);

            // Draw red point at target x bullet intersection
            target_pos.sub(object.pos);
            draw_point(renderer, target_pos.x(), target_pos.y(), 2, "red");
        }
        else {
            console.log("Warning: no firing angle solutions found");
        }

        return result.angle;
    }

    // fire if current aim close enough to targeted aim && cooldown passed
    do_fire(current_angle, target_angle) {
        return Math.abs(current_angle - target_angle) < this.dna.min_fire_error;
    }

    get_evading_vector(object, near_by_objects) {
        let evading_v = new Vector2();

        // Objects
        for (const obj of near_by_objects) {
            let encounter = TrajectoryPredictor.get_encounter(object, obj);
            let dist = encounter.pos1.clone().sub(encounter.pos2);

            if (encounter.dt < this.dna.encounter_time_max &&
                dist.norm() - obj.radius - object.radius < this.dna.encounter_dist_max) {
                // Evade
                let score = 1 / (encounter.dt + dist.norm() + 1);
                evading_v.add(dist.mul(score));
            }
        }

        // Walls
        let dists = CollisionManager.get_dists_to_bounds(object, 0, framework.width, 0, framework.height);
        for (let dist of dists) {
            let score = this.dna.wall_K / (dist.norm() + 1);
            evading_v.add(dist.mul(score));
        }

        return evading_v;
    }

    control_from_vector(object, speed_target) {
        let object_angle = this.get_angle(object);

        let target_angle = speed_target.angle();
        let target_vel = Vector2.fromAngle(object_angle).scalar(speed_target);

        // speed_target.draw("green", 1);
        // Vector2.fromAngle(target_angle).normalize(target_vel).draw("blue", 1);
        // console.log("Tests");
        // console.log(target_angle);
        // console.log(object.vel.norm());
        // console.log(target_vel); // NaN
        // console.log(object_angle);
        // console.log(target_angle); // Nan


        return {
            "thrust": this.vel_pid.control(object.vel.norm(), target_vel, framework.app.sim_dt),
            "rotation": this.angle_pid.control(object_angle, target_angle, framework.app.sim_dt),
        };
    }

    searching(object, near_by_objects) {
        let speed_target = new Vector2();

        // Go to center
        let center = new Vector2(framework.width / 2, framework.height / 2);
        let diff_pos = center.sub(object.pos);
        speed_target.add(diff_pos.mul(this.dna.searching_K));
        speed_target.add(this.get_evading_vector(object, near_by_objects));


        return this.control_from_vector(object, speed_target);
    }

    positionning(object, near_by_objects) {
        let speed_target = new Vector2();

        // Constrain target distance to object
        let diff_pos = this.target.pos.clone().sub(object.pos);
        let target_pos = diff_pos.clone().normalize(this.dna.wanted_target_dist);
        let error = diff_pos.sub(target_pos);

        speed_target.add(error.mul(this.dna.positionning_K));
        speed_target.add(this.get_evading_vector(object, near_by_objects));

        return this.control_from_vector(object, speed_target);
    }

    aiming(object, near_by_objects) {
        let target_angle = this.get_firering_angle(object);
        let object_angle = this.get_angle(object);

        // Evade only impacts thrust
        let speed_target = this.get_evading_vector(object, near_by_objects);
        let evade_control = this.control_from_vector(object, speed_target);

        return {
            "thrust": constrain_value(evade_control.thrust, this.dna.min_thrust, 1),
            "rotation": this.angle_pid.control(object_angle, target_angle, framework.app.sim_dt),
            "fire": this.do_fire(object_angle, target_angle),
        };
    }

    turret(object, near_by_objects) {
        let target_angle = this.get_firering_angle(object);
        let object_angle = this.get_angle(object);

        return {
            "rotation": this.angle_pid.control(object_angle, target_angle, framework.app.sim_dt),
            "fire": this.do_fire(object_angle, target_angle),
        };
    }

    fleeing(object, near_by_objects) {
        let speed_target = new Vector2();

        speed_target.add(this.get_evading_vector(object, near_by_objects));

        return this.control_from_vector(object, speed_target);
    }

    change_state(new_state) {
        // console.log("Changing state to: " + new_state.code);

        this.state = new_state;

        // Resets the pid
        this.angle_pid.reset_prev();
    }

    control(object) {
        // Debug drawing translate to object
        let renderer = framework.get_renderer();
        renderer.translate(object.pos.x(), object.pos.y());

        // Manage target
        let near_by_objects = CollisionManager.get_near_objects(object, AIController.vision_range, "space");
        this.manage_target(object, near_by_objects);

        // Manage state
        let new_state = this.state.update(object);
        if (new_state != this.state) {
            this.change_state(new_state);
        }

        // Generate command
        let command = {};

        try {
            command = this[this.state.code](object, near_by_objects);
        }
        catch (error) {
            console.log(error);
        }

        // Reset debug drawing context
        renderer.resetTransform();

        return command;
    }
}
