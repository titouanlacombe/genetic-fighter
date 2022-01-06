// Error when abstract class function is not implemented
function abstract_error()
{
	throw new Error("You must implement this function: " + arguments.callee);
}
