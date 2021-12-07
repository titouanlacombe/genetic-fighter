let fastMode = false;
let width, height;

window.requestAnimationFrame(_init);

function _init()
{
	init();

	if (fastMode) {
		computeLoop();
	}
	else {
		interactiveLoop();
	}
}

function interactiveLoop()
{
	simulate();
	draw();

	if (running) {
		window.requestAnimationFrame(interactiveLoop);
	}
}

function computeLoop()
{
	while (running) {
		simulate();
	}
}

// Callback to update the canvas size
window.addEventListener('resize', () => {
	let canvas = document.getElementById('canvas');

	// Update the canvas size
	canvas.width = canvas.parentElement.width;
	canvas.height = canvas.parentElement.height;
	
	// Remove padding & update global vars
	let computedStyle = getComputedStyle(canvas.parentElement);
	width = canvas.width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
	height = canvas.height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
});
