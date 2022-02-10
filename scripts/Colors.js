/**
 * Usefull class to manipulate colors
 */
class Color
{
	/**
	 * Static vars of common colors
	 */
	static white = new Color(255, 255, 255);
	static black = new Color(0, 0, 0);
	static red = new Color(255, 0, 0);
	static green = new Color(0, 255, 0);
	static blue = new Color(0, 0, 255);
	static yellow = new Color(255, 255, 0);
	static magenta = new Color(255, 0, 255);
	static cyan = new Color(0, 255, 255);

	/**
	 * @constructor
	 * @param {Number} r red 
	 * @param {Number} g green 
	 * @param {Number} b blue
	 */
	constructor(r, g, b)
	{
		this.r = r;
		this.g = g;
		this.b = b;
	}

	/**
	 * Return color in string format
	 * @returns {String} rgb(r,g,b)
	 */
	toString()
	{
		return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
	}

	/**
	 * Return color in array format
	 * @returns {Array} [r, g, b]
	 */
	toRGB()
	{
		return [this.r, this.g, this.b];
	}

	/**
	 * Return color in hex format
	 * @returns {String} #rrggbb
	 */
	toHex()
	{
		let rgb = this.toRGB();
		let hex = '#';
		for (const element of rgb) {
			if (element.toString().length === 1) hex += '0';
			hex += element.toString(16);
		}
		return hex;
	}

	/**
	 * Blend the source & the target colors according to ratio to create a new color between them
	 * @param {Color} color1 Source
	 * @param {Color} color2 Target
	 * @param {Number} ratio between 0 & 1
	 * @returns {Color}
	 */
	static lerp(color1, color2, ratio)
	{
		let reverse_ratio = 1 - ratio;

		return new Color(
			color1.r * ratio + color2.r * reverse_ratio,
			color1.g * ratio + color2.g * reverse_ratio,
			color1.b * ratio + color2.b * reverse_ratio
		);
	}

	/**
	 * Create a color from a hex string
	 * @param {String} hex 
	 * @returns {Color}
	 */
	static fromHex(hex)
	{
		let c;
		if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
			c = hex.substring(1).split('');
			if (c.length == 3) {
				c = [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c = '0x' + c.join('');
			return new Color((c >> 16) & 255, (c >> 8) & 255, c & 255);
		}
		throw new Error('Bad Hex : ' + hex);
	}
}
