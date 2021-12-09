// Control the object via key presses
class Player1Controller extends Controller
{
	constructor() {
		super();
		this.thrust = 0;
		this.rotate = 0;
		this.fire = false;
	}

	control(object, dt, objects) {
		object.command_rotation(this.rotate);
		object.command_thrust(this.thrust, dt);
		if (this.fire) {
			object.fire(dt, objects);
			this.fire = false;
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
			this.rotate = status ? -1 : 0;
		}
		else if (code == "ArrowRight") {
			this.rotate = status ? 1 : 0;
		}
	}
}
