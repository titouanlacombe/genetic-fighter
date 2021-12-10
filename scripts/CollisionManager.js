class CollisionManager {
    static object_to_bounds(objects, min_x, max_x, min_y, max_y, include_radius = false) {
        objects.forEach(object => {
            let radius = include_radius ? object.radius : 0;

            if (object.pos.x - radius < min_x) {
                object.out_of_bound("min_x");
            } else if (object.pos.x + radius > max_x) {
                object.out_of_bound("max_x");
            }

            if (object.pos.y - radius < min_y) {
                object.out_of_bound("min_y");
            } else if (object.pos.y + radius > max_y) {
                object.out_of_bound("max_y");
            }
        });
    }

    static object_to_object(objects) {
        objects.forEach(object1 => {
            objects.forEach(object2 => {
                if (object1 != object2 &&
                    Vector2.diff(object1.pos, object2.pos).norm() < object1.radius + object2.radius) {
                    object1.collision(object2);
                }
            });
        });
    }
}