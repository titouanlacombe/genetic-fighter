// Abstract class Control a game object
class Controller
{
    constructor(obj) {
        this.object = obj;
    }

    control() {
        abstractError();
    }

    input() {
        abstractError();
    }
}
