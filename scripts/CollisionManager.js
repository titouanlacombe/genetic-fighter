class CollisionManager
{
    static check_collisions(objects)
    {
        // Object collision
		objects.forEach(object1 => {
            objects.forEach(object2 => {
                if (object1 != object2
                    && Vector2.dist(object1.pos, object2.pos).norm() < object1.radius + object2.radius)
                {
                    object1.collision(object2);
                }
            });
		});

        // Wall collisions (TODO)
    }
}
