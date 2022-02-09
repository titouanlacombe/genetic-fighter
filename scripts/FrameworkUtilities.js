// Error when abstract class function is not implemented
function abstract_error() {
    throw new Error("You must implement this function: " + arguments.callee);
}

function constrain_value(value, min = 0, max = 1) {
    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }

    return value;
}

function map_value(s, min, max, wanted_min = 0, wanted_max = 1) {
    // Normalize s
    let scale = max - min;
    s = (s - min) / scale;

    // Scale s
    let wanted_scale = wanted_max - wanted_min;
    s = (s * wanted_scale) + wanted_min;

    return s;
}

function draw_point(renderer, x, y, radius = 5, style = "red") {
    renderer.fillStyle = style;
    renderer.beginPath();
    renderer.arc(x, y, radius, 0, 2 * Math.PI);
    renderer.fill();
}

function draw_line(renderer, xa, ya, xb, yb, width = 2, style = "red") {
    renderer.strokeStyle = style;
    renderer.lineWidth = width;
    renderer.beginPath();
    renderer.moveTo(xa, ya);
    renderer.lineTo(xb, yb);
    renderer.stroke();
}

function randval(min = 0, max = 100) {
    return Math.random() * (max - min) + min;
}