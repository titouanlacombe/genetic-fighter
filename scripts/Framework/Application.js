/**
 * Interface Application, launched by framework
 * @interface
 */
class Application {
	/**
	 * @constructor
	 */
	constructor() {
		/** Tells the app loop if it should keep running */
		this.running = true;
	}

	/**
	 * Called on init
	 */
	initing() {
	}

	/**
	 * Called on exit
	 */
	exiting() {
	}

	/**
	 * Called at each animation frame
	 */
	update() {
	}

	/**
	 * Called if app crashes
	 */
	crashed() {
	}
}
