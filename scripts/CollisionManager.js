class CollisionManager {
	static distances_cache = new Map();

	static get_dist_obj(obj1, obj2) {
		let dist = obj2.dist_to(obj1);
		return {
			"object": obj2,
			"dist": dist,
			"space": dist - obj1.radius - obj2.radius,
		};
	}

	static update_distances_cache(objects) {
		let map_objects = Array.from(this.distances_cache.keys());
		let new_objects = objects.filter(value => !map_objects.includes(value));
		let old_objects = objects.filter(value => map_objects.includes(value));
		let dead_objects = map_objects.filter(value => !objects.includes(value));

		// Delete dead object
		dead_objects.forEach(obj => {
			this.distances_cache.delete(obj);
		});

		// Create new objects
		new_objects.forEach(obj1 => {
			let distances = [];
			objects.forEach(obj2 => {
				distances.push(this.get_dist_obj(obj1, obj2));
			});
			
			distances.sort((a, b) => { return a.space - b.space; });
			distances.splice(distances.find((e) => { return e.object == obj1; }), 1); // Remove obj1 from it's array

			this.distances_cache.set(obj1, distances);
		});
		
		// Update old objects
		old_objects.forEach(obj1 => {
			let distances = this.distances_cache.get(obj1);

			// Filter out data of dead objects
			distances = distances.filter(value => !dead_objects.includes(value.object));
			
			// Update distance of old objects
			distances.forEach(dist_obj => {
				let dist = dist_obj.object.dist_to(obj1);
				dist_obj.dist = dist;
				dist_obj.space = dist - obj1.radius - dist_obj.object.radius;
			});

			// Add distance of new objects
			new_objects.forEach(obj2 => {
				distances.push(this.get_dist_obj(obj1, obj2));
			});

			distances.sort((a, b) => { return a.space - b.space; });

			this.distances_cache.set(obj1, distances);
		});
	}

	// mode can be "dist" or "space"
	static get_near_objects(object, max_dist, mode = "space") {
		let distances = this.distances_cache.get(object);
		
		if (!distances) {
			// console.log("can't find object: ", object);
			return [];
		}
		
		let distances_it = distances.values();
		let data = distances_it.next();
		let results = [];
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