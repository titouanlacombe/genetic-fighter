/**
 * Implement PID controller
 */
class PIDController
{
	/**
	 * @constructor
	 * @param {Number} p Proportional factor
	 * @param {Number} i Integral factor
	 * @param {Number} d Derivative factor
	 */
    constructor(p, i, d)
    {
        this.Kp = p;
        this.Ki = i;
        this.Kd = d;

        this.prev_error = null;
        this.I = 0;
    }

	/**
	 * Reset PID state
	 */
    reset_prev()
    {
        this.prev_error = null;
    }

	/**
	 * Return the output value of the PID controller
	 * @param {Number} current Current value
	 * @param {Number} target  Target value
	 * @param {Number} dt Time between last control call
	 * @returns {Number}
	 */
    control(current, target, dt)
    {
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