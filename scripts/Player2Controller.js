/**
 * Controller of Player2
 * Just remap the Player1 inputs 
 * Control object with ZQSD keys
 * @extends Controller
 */
class Player2Controller extends Player1Controller
{
    /**
     * Procces Keyboard inputs
     * @param {String} code KeyCode
     * @param {Boolean} status true: keyup, false: keydown
     */
    input(code, status)
    {
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
