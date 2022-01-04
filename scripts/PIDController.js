class PIDController
{
    constructor(p, i, d)
    {
        this.Kp = p;
        this.Ki = i;
        this.Kd = d;

        this.integral = 0;
        this.prev_error = null;
    }

    // Takes current value, target value, dt and returns the control force to apply
    control(current, target, dt)
    {
        let error = target - current;

        // Integral
        this.integral += error * dt;

        // Derivative
        let derivative = 0;
        if (this.prev_error) {
            derivative = (error - this.prev_error) / dt;
        }
        this.prev_error = error;

        return error * this.Kp
            + this.integral * this.Ki
            + derivative * this.Kd;
    }
}