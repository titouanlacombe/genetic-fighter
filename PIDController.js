class PIDController {
    static cache = new Map();

    constructor(p, i, d) {
        this.Kp = p;
        this.Ki = i;
        this.Kd = d;

        this.integral = 0;
        this.prev_error = null;
    }

    // takes current aim, target aim and dt and returns force?
    control(current_aim, target_aim, dt) {

        let error = target_aim - current_aim;

        // Integral
        this.integral += error * dt

        // Derivative
        if (this.prev_error)
            let derivative = (error - this.prev_error) / dt;

        this.prev_error = error;

        return error * this.Kp
            + this.integral * this.Ki
            + derivative * this.Kd;
    };
}