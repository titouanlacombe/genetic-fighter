/**
 * Controller of Player1
 * Control object with the keyboard arrows
 * @extends Controller
 */
class Player1Controller extends Controller {
	/**
	 * @constructor
	 */
	constructor() {
		super();
		this.thrust = 0;
		this.rotation = 0;
		this.fire = false;
		this.state = "Player"; // hack, because AI controller have a state but not players
	}

	/**
	 * Return the last user inputs to control the object
	 * @returns {CommandObject}
	 */
	control() {
		return {
			"thrust": this.thrust,
			"rotation": this.rotation,
			"fire": this.fire,
		}
	}

	/**
	 * Procces Keyboard inputs
	 * @param {String} code KeyCode
	 * @param {Boolean} status true: keyup, false: keydown
	 */
	input(code, status) {
		// console.log(code, status);

		if (code == "ArrowUp") {
			this.thrust = status ? 1 : 0;
		}
		else if (code == "ArrowDown") {
			this.fire = status;
		}
		else if (code == "ArrowLeft") {
			this.rotation = status ? -1 : 0;
		}
		else if (code == "ArrowRight") {
			this.rotation = status ? 1 : 0;
		}
	}
}
