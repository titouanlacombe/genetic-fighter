class State {
	constructor(code) {
		this.code = code;
		this.exits = [];
	}

	add_exit(state, condition) {
		this.exits.push({
			"state": state,
			"condition": condition,
		});
	}

	update(object) {
		for (const exit of this.exits) {
			if (exit.condition(object)) {
				return exit.state;
			}
		}
		return this;
	}
}
