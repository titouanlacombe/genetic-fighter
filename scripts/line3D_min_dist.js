class Line3 {
    constructor(point, direction) {
        this.point = point;
        this.direction = direction;
    }

    // Return the minimum distance between 2 3D lines
    dist_to(line) {
        // vc = cross_product(va, vb)
        let vc = va.cross(vb);
        let norm = vc.norm();
    
        if (norm == 0) {
            return 0;
        }
    
        // Find lines equations
        // da = - (xc * xa + yc * ya + zc * za)
        let da = - (vc.data[0] * va.data[0] + vc.data[1] * va.data[1] + vc.data[2] * va.data[2]);
        // db = - (xc * xb + yc * yb + zc * zb)
        let db = - (vc.data[0] * vb.data[0] + vc.data[1] * vb.data[1] + vc.data[2] * vb.data[2]);
    
        // return the distance, but where is the point ?
        return Math.abs(da - db) / norm;
    }
}
