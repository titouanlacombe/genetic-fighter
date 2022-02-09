class PIDController {
    constructor(p, i, d) {
        // console.log("p " + p + " i " + i + " d " + d);

        this.Kp = p;
        this.Ki = i;
        this.Kd = d;

        this.prev_error = null;
        this.I = 0;
    }

    reset_prev() {
        this.prev_error = null;
    }

    // Takes current value, target value, dt and returns the control force to apply
    control(current, target, dt) {
        // console.log(current, target);
        let error = target - current;
        // console.log('error? ' + error);

        // Proportional
        let P = this.Kp * error;

        let D = 0;
        if (this.prev_error !== null) {
            // Integral
            this.I += this.Ki * error * dt;

            // Derivative
            D = this.Kd * (error - this.prev_error) / dt;
        }

        // Update previous error
        this.prev_error = error;

        // console.log("P: " + P + ", I: " + this.I + ", D: " + D);

        return P + this.I + D;
    }
}