function hexToRgb(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
    }
    throw new Error('Bad Hex : ' + hex);
}

function RgbToHex(rgb) {
    let hex = '#';
    rgb.forEach(element => {
        if (element.toString().length === 1) hex += '0';
        hex += element.toString(16);
    });

    return hex;
}

function merge_colors(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    c1 = hexToRgb(color1);
    c2 = hexToRgb(color2);

    var p = amount / 100;

    var rgb = [
        Math.round(c1[0] * p + c2[0] * (1 - p)),
        Math.round(c1[1] * p + c2[1] * (1 - p)),
        Math.round(c1[2] * p + c2[2] * (1 - p)),
    ];

    return RgbToHex(rgb);
}