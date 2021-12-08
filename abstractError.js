// Error when abstract class function is not implemented
function abstractError()
{
	throw new Error("You must implement this function: " + arguments.callee);
}
