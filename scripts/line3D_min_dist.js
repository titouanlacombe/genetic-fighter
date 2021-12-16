// Return the minimum distance between 2 3D lines
function line3D_min_dist(xa, ya, za, xb, yb, zb) {
    let cross_product = xa * xb + ya * yb + za * zb;
    // => calc cross product (xc, yc, zc)
    // find da = - xc * xa - yc * ya - zc * za
    // find db = - xc * xb - yc * yb - zc * zb
    // dist = abs(da - db) / sqrt(xc*xc + yc*yc + zc*zc)
}
