class Player2Controller extends Player1Controller {
    input(code, status) {
        // console.log(code, status);

        if (code == "KeyW" || code == "KeyZ") {
            super.input("ArrowUp", status);
        }
        else if (code == "KeyS") {
            super.input("ArrowDown", status);
        }
        else if (code == "KeyA" || code == "KeyQ") {
            super.input("ArrowLeft", status);
        }
        else if (code == "KeyD") {
            super.input("ArrowRight", status);
        }
    }
}
