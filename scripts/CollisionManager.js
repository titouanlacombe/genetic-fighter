class CollisionManager {
	static distances_cache;
	
	static update_distances_cache(objects) {
		this.distances_cache = new Map();

		objects.forEach(obj1 => {
			let distances = [];

			objects.forEach(obj2 => {
				let dist = obj2.dist_to(obj1);
				distances.push({
					"object": obj2,
					"dist": dist,
					"space": dist - obj1.radius - obj2.radius,
				});
			});

			distances.sort((a, b) => { return a.space - b.space; });
			distances.splice(distances.find((e) => { return e.object == obj1; }), 1); // Remove obj1 from it's array

			this.distances_cache.set(obj1, distances);
		});
	}

	// mode can be "dist" or "space"
	static get_near_objects(object, max_dist, mode = "space") {
		let results = [];

		let distances_it = this.distances_cache.get(object).values();
		let data = distances_it.next();
		while (!data.done && data.value[mode] < max_dist) {
			results.push(data.value["object"]);
			data = distances_it.next();
		}
		
		return results;
	}

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
			let near_object = this.get_near_objects(object1, 0, "space");

			near_object.forEach(object2 => {
				object1.collision(object2);
			});
		});
	}
}