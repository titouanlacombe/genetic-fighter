class Player2Controller extends Player1Controller {
    input(code, status) {
        // console.log(code, status);

        if (code == "KeyW" || code == "KeyZ") {
            this.thrust = status ? 1 : 0;
        }
        else if (code == "KeyS") {
            this.fire = status;
        }
        else if (code == "KeyA" || code == "KeyQ") {
            this.rotate = status ? -1 : 0;
        }
        else if (code == "KeyD") {
            this.rotate = status ? 1 : 0;
        }
    }
}