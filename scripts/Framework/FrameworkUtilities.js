/**
 * Hack
 * Throws simple error
 * Use on abstract class functions so that they throw an error
 */
function abstract_error() {
	throw new Error("You must implement this function: " + arguments.callee);
}

/**
 * Project value to the space between min & max
 * @param {Number} value 
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function constrain_value(value, min = 0, max = 1) {
	if (value < min) {
		return min;
	}

	if (value > max) {
		return max;
	}

	return value;
}

function pick_random(list) {
	return list[Math.floor(Math.random() * list.length)];
}

/**
 * Scale s from [min, max] to [wanted_min, wanted_max]
 * If min == max return average of wanted_min & wanted_max
 * @param {Number} s 
 * @param {Number} min 
 * @param {Number} max 
 * @param {Number} wanted_min 
 * @param {Number} wanted_max 
 * @returns {Number}
 */
function map_value(s, min, max, wanted_min = 0, wanted_max = 1) {
	// Normalize s
	let scale = max - min;

	if (scale == 0) {
		return (wanted_min + wanted_max) / 2;
	}

	s = (s - min) / scale;

	// Scale s
	let wanted_scale = wanted_max - wanted_min;
	s = (s * wanted_scale) + wanted_min;

	return s;
}

/**
 * Draws a simple circle
 * @param {Renderer} renderer 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} radius in pixels
 * @param {String} style 
 */
function draw_point(renderer, x, y, radius = 5, style = "red") {
	renderer.fillStyle = style;
	renderer.beginPath();
	renderer.arc(x, y, radius, 0, 2 * Math.PI);
	renderer.fill();
}

/**
 * Draw a line between (xa, ya) and (xb, yb)
 * @param {Renderer} renderer 
 * @param {Number} xa 
 * @param {Number} ya 
 * @param {Number} xb 
 * @param {Number} yb 
 * @param {Number} width in pixels
 * @param {String} style 
 */
function draw_line(renderer, xa, ya, xb, yb, width = 2, style = "red") {
	renderer.strokeStyle = style;
	renderer.lineWidth = width;
	renderer.beginPath();
	renderer.moveTo(xa, ya);
	renderer.lineTo(xb, yb);
	renderer.stroke();
}

function draw_graph(renderer, numbers_list, line_color, graph_x, graph_y, graph_width, graph_height) {
	// Precondition
	if (numbers_list.length < 1) {
		return;
	}

	// Graph limits
	let graph_y2 = graph_y + graph_height;
	let graph_x2 = graph_x + graph_width;

	// numbers_list min/max
	let min_val = Math.min(...numbers_list);
	let max_val = Math.max(...numbers_list);

	// Renderer config
	renderer.lineWidth = 2;
	renderer.strokeStyle = line_color.toString();
	renderer.beginPath();

	let element_x;
	let element_y;
	let i = 0;

	function draw_vertex(method) {
		element_x = map_value(i, 0, numbers_list.length, graph_x, graph_x2);
		// Invert graph_y2 & graph_y because in canvas screenspace y dimension is inverted
		element_y = map_value(numbers_list[i], min_val, max_val, graph_y2, graph_y);
		renderer[method](element_x, element_y);
	}

	// First point
	draw_vertex("moveTo");

	// Rest of the points
	for (i = 1; i < numbers_list.length; i++) {

		draw_vertex("lineTo");
	}

	renderer.stroke();
}

/**
 * Generate a random value between min & max
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function randval(min = 0, max = 100) {
	return Math.random() * (max - min) + min;
}

/**
 * Create a file with filename and make user download it
 * @param {String} filename name of the file to be downloaded
 * @param {String} text file content
 */
function create_download(filename, text) {
	var element = document.createElement('a');
	element.style.display = 'none';

	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function request_files(callback, accept) {
	var element = document.createElement("input");
	element.style.display = 'none';

	element.setAttribute("type", "file");
	if (accept) {
		element.setAttribute('accept', accept);
	}
	element.addEventListener('change', (e) => {
		callback(e.target.files);
	}, false);

	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function read_file(file, callback) {
	var reader = new FileReader();
	reader.onload = function (e) {
		var contents = e.target.result;
		callback(contents);
	};
	reader.readAsText(file);
}

/**
 * Solve the polynome: A*x^2 + B*x + C = 0
 * @param {Number} A 
 * @param {Number} B 
 * @param {Number} C 
 * @returns {Array} Array of solutions
 */
function resolve_poly2(A, B, C) {
	// TODO add preconditions for A, B, C
	let delta = B ** 2 - 4 * A * C;

	if (delta < 0) {
		// No solutions
		return [];
	}
	else if (delta == 0) {
		let x1 = - B / (2 * A);
		return [x1];
	}
	else {
		let del = Math.sqrt(delta);
		let x1 = (- B + del) / (2 * A);
		let x2 = (- B - del) / (2 * A);

		return [x1, x2];
	}
}
