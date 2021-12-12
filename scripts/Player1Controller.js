// Control the object via key presses
class Player1Controller extends Controller
{
	constructor() {
		super();
		this.thrust = 0;
		this.rotation = 0;
		this.fire = false;
	}

	control() {
		return {
			"thrust": this.thrust,
			"rotation": this.rotation,
			"fire": this.fire,
		}
	}

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
