// Control the object via key presses
class PlayerController extends Controller
{
	constructor(obj) {
		super(obj);

		this.thrusting = 0;
		this.rotate = 0;
	}

	control() {
		// command thrust
		this.object.command_rotation(this.rotate);
		this.object.command_thrust(this.thrusting);

		// command rotation
		
		// command fire
	}

	input(code, status) {
		// console.log(code, status);

		if (code == "ArrowUp") {
			this.thrusting = status ? 1 : 0;
		}
		else if (code == "ArrowDown") {
			if (status) { this.object.fire(); }
		}
		else if (code == "ArrowLeft") {
			this.rotate = status ? -1 : 0;
		}
		else if (code == "ArrowRight") {
			this.rotate = status ? 1 : 0;
		}
	}
}
