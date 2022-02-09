/**
 * 2D Vector class
 * @extends Vector
 */
class Vector2 extends Vector
{
	/**
	 * @constructor
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	constructor(x = 0, y = 0)
	{
		super([x, y]);
	}

	/**
	 * Return the x composant
	 * @returns {Number} x
	 */
	x()
	{
		return this.data[0];
	}

	/**
	 * Return the y composant
	 * @returns {Number} y
	 */
	y()
	{
		return this.data[1];
	}

	/**
	 * Set the x composant
	 * @returns {Vector2} this
	 */
	setx(v)
	{
		this.data[0] = v;
		return this;
	}

	/**
	 * Set the y composant
	 * @returns {Vector2} this
	 */
	sety(v)
	{
		this.data[1] = v;
		return this;
	}

	/**
	 * Set the vector data
	 * @returns {Vector2} this
	 */
	set(x = 0, y = 0)
	{
		this.setx(x);
		this.sety(y);
		return this;
	}

	/**
	 * Return a copy of this vector
	 * @returns {Vector} copy
	 */
	clone()
	{
		return new Vector2(this.x(), this.y());
	}

	/**
	 * Rotate this by angle
	 * @param {Number} angle in radians
	 * @returns {Vector2} this
	 */
	rotate(angle)
	{
		let cs = Math.cos(angle);
		let sn = Math.sin(angle);
		let tempX = this.x(); // Very important
		this.setx(this.x() * cs - this.y() * sn);
		this.sety(tempX * sn + this.y() * cs);
		return this;
	}

	/**
	 * Return this vector angle
	 * @returns {Vector2} this
	 */
	angle()
	{
		return Math.atan2(this.y(), this.x());
	}

	/**
	 * Draw a debug of the vector to the framework renderer
	 * To draw at custom location set the renderer context before calling draw
	 * @param {Color} color 
	 * @param {Number} scale 
	 * @returns {Vector2} this
	 */
	draw(color = Color.white, scale = 1)
	{
		let v = this.clone().mul(scale);

		let renderer = framework.get_renderer();
		draw_line(renderer, 0, 0, v.x(), v.y(), 2, color);

		return this;
	}

	/**
	 * Create a unit vector (vector of norm 1) from an angle
	 * @param {Number} angle 
	 * @returns {Vector2} new vector
	 */
	static fromAngle(angle)
	{
		return new Vector2(Math.cos(angle), Math.sin(angle));
	}
}
