// Error when interface function is not implemented
function interfaceError()
{
    throw new Error("You must implement this function: " + arguments.callee);
}

// Interface GameObject
class GameObject
{
    constructor() {
    }
    
    simulate() {
        interfaceError();
    }
    
    draw() {
        interfaceError();
    }
}
