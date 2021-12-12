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
        this.exits.forEach(exit => {
            if (exit.condition(object)) {
                return exit.state;
            }
        });
        return this;
    }
}
