/**
 * GameObject
 * Handle basic simulation & drawing
 * @abstract
 */
class GameObjectInterface {
	/**
	 * Simulate the object
	 * @param {Number} dt delta time between steps 
	 * @param {Array} objects array of GameObjects
	 */
	update(objects, dt) {
		// Empty
	}

	/**
	 * Ask the objetc to draw itself with renderer
	 * @param {Renderer} renderer 
	 */
	draw() {
		// Empty
	}

	/**
	 * Called when object is removed from objects list
	 */
	die() {
		// Empty
	}
}