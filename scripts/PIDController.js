class PIDController
{
    constructor(p, i, d)
    {
        this.Kp = p;
        this.Ki = i;
        this.Kd = d;

        this.prev_error = null;
    }

    reset_prev()
    {
        this.prev_error = null;
    }

    // Takes current value, target value, dt and returns the control force to apply
    control(current, target, dt)
    {
        let error = target - current;

        // Proportional
        let proportional = error;

        let integral = 0;
        let derivative = 0;
        if (this.prev_error !== null) {
            // Integral
            integral = ((error + this.prev_error) / 2) * dt;

            // Derivative
            derivative = (error - this.prev_error) / dt;
        }
        this.prev_error = error;

        return proportional * this.Kp
            + integral * this.Ki
            + derivative * this.Kd;
    }
}