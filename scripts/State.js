class State {
    constructor() {
        this.exits = [];
    }

    add_exit(condition, state) {
        this.exits.push({
            "condition": condition,
            "state": state,
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
