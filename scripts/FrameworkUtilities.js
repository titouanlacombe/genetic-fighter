/**
 * Hack
 * Throws simple error
 * Use on abstract class functions so that they throw an error
 */
function abstract_error()
{
    throw new Error("You must implement this function: " + arguments.callee);
}

/**
 * Project value to the space between min & max
 * @param {Number} value 
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function constrain_value(value, min = 0, max = 1)
{
    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }

    return value;
}

/**
 * Scale s from [min, max] to [wanted_min, wanted_max]
 * @param {Number} s 
 * @param {Number} min 
 * @param {Number} max 
 * @param {Number} wanted_min 
 * @param {Number} wanted_max 
 * @returns {Number}
 */
function map_value(s, min, max, wanted_min = 0, wanted_max = 1)
{
    // Normalize s
    let scale = max - min;
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
function draw_point(renderer, x, y, radius = 5, style = "red")
{
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
function draw_line(renderer, xa, ya, xb, yb, width = 2, style = "red")
{
    renderer.strokeStyle = style;
    renderer.lineWidth = width;
    renderer.beginPath();
    renderer.moveTo(xa, ya);
    renderer.lineTo(xb, yb);
    renderer.stroke();
}

function randval(min = 0, max = 100)
{
    return Math.random() * (max - min) + min;
}