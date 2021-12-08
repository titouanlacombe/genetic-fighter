// Control the object via key presses
class PlayerController extends Controller
{
	constructor(obj) {
		super(obj);

		this.thrusting = false;
		this.rotate = 0;
	}

	control() {
		// command thrust
		if (this.rotate) { this.object.command_rotation(this.rotate); }
		this.object.command_thrust(this.thrusting ? 1 : 0);

		// command rotation
		
		// command fire
	}

	input(code) {
		if (code == "z") {
			this.thrusting = true;
		}
		else if (code == "s") {
			this.object.fire();
		}
		else if (code == "q") {
			this.rotate = -1;
		}
		else if (code == "d") {
			this.rotate = 1;
		}
	}
}
