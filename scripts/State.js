/**
 * Simple state machine node where exits conditions are functions
 */
class State
{
	/**
	 * @constructor
	 * @param {String} code To debug in what state we are in
	 */
	constructor(code)
	{
		this.code = code;
		/** Exits */
		this.exits = [];
	}

	/**
	 * Add an exit condition to this state machine node
	 * @param {State} state If exit true got to this state
	 * @param {CallableFunction} condition Function, return true to exit
	 */
	add_exit(state, condition)
	{
		this.exits.push({
			"state": state,
			"condition": condition,
		});
	}

	/**
	 * Returns the new state of the machine:
	 * Either the first exit condition reached or this state if no exit conditions where found
	 * @param {UserData} data 
	 * @returns {State} The new state
	 */
	update(data)
	{
		for (const exit of this.exits) {
			if (exit.condition(data)) {
				return exit.state;
			}
		}
		return this;
	}
}
