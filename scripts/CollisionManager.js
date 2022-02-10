/**
 * Collision manager manage collision between game objects
 */
class CollisionManager {
	/**
	 * Cache wich store the distance info of each object relative to each other
	 */
	static distances_cache = new Map();

	/**
	 * Returns the distance between the two objects
	 * With and without their radiuses
	 * 
	 * @param {GameObject} obj1 
	 * @param {GameObject} obj2 
	 * @returns {DistanceObject} See the code
	 */
	static get_dist_obj(obj1, obj2) {
		let dist = obj2.dist_to(obj1);
		return {
			"object": obj2,
			"dist": dist,
			"space": dist - obj1.radius - obj2.radius,
		};
	}

	/**
	 * Update the cache with the array of game objects
	 * 
	 * @param {Array} objects array of GameObjects
	 */
	static update_distances_cache(objects) {
		let map_objects = Array.from(this.distances_cache.keys());
		let new_objects = objects.filter(value => !map_objects.includes(value));
		let old_objects = objects.filter(value => map_objects.includes(value));
		let dead_objects = map_objects.filter(value => !objects.includes(value));

		// Delete dead object
		for (const obj of dead_objects) {
			this.distances_cache.delete(obj);
		}

		// Create new objects
		for (const obj1 of new_objects) {
			let distances = [];

			for (const obj2 of objects) {
				distances.push(this.get_dist_obj(obj1, obj2));
			}

			distances.sort((a, b) => { return a.space - b.space; });

			// Remove obj1 from it's array
			let i = 0;
			while (distances[i].object != obj1) {
				i++;
			}
			distances.splice(i, 1);

			this.distances_cache.set(obj1, distances);
		}

		// Update old objects
		for (const obj1 of old_objects) {
			let distances = this.distances_cache.get(obj1);

			// Filter out data of dead objects
			distances = distances.filter(value => !dead_objects.includes(value.object));

			// Update distance of old objects
			for (const dist_obj of distances) {
				let dist = dist_obj.object.dist_to(obj1);
				dist_obj.dist = dist;
				dist_obj.space = dist - obj1.radius - dist_obj.object.radius;
			}

			// Add distance of new objects
			for (const obj2 of new_objects) {
				distances.push(this.get_dist_obj(obj1, obj2));
			}

			distances.sort((a, b) => { return a.space - b.space; });

			this.distances_cache.set(obj1, distances);
		}
	}

	/**
	 * Returns the array of objects near object
	 * 
	 * @param {GameObject} object Target object
	 * @param {Number} max_dist radius of research, wont return any objects beyond that
	 * @param {String} mode either "space" to take radiuses into account or "dist" if you don't want to
	 * @returns {Array} 
	 */
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

	/**
	 * Return the closest distance you are from the bound box
	 * 
	 * @param {GameObject} object 
	 * @param {Number} min_x min x of the box bounds
	 * @param {Number} max_x max x of the box bounds
	 * @param {Number} min_y min y of the box bounds
	 * @param {Number} max_y max y of the box bounds
	 * @returns {Number} minimum distance
	 */
	static get_dists_to_bounds(object, min_x, max_x, min_y, max_y) {
		let x = object.pos.x();
		let y = object.pos.y();

		let dists = [];

		dists.push(new Vector2(max_x - x, min_y - y));
		dists.push(new Vector2(max_x - x, max_y - y));
		dists.push(new Vector2(min_x - x, min_y - y));
		dists.push(new Vector2(min_x - x, max_y - y));

		return dists;
	}

	/**
	 * Manage OOB collisions of objects
	 * Calls their out_of_bound method if they leave the area
	 * 
	 * @param {Array} objects 
	 * @param {Number} min_x min x of the box bounds
	 * @param {Number} max_x max x of the box bounds
	 * @param {Number} min_y min y of the box bounds
	 * @param {Number} max_y max y of the box bounds
	 * @param {Boolean} include_radius include radius in distance
	 * @returns {Number} minimum distance
	 */
	static object_to_bounds(objects, min_x, max_x, min_y, max_y, include_radius = false) {
		for (const object of objects) {
			let radius = include_radius ? object.radius : 0;

			if (object.pos.x() - radius < min_x) {
				object.out_of_bound("min_x");
			} else if (object.pos.x() + radius > max_x) {
				object.out_of_bound("max_x");
			}

			if (object.pos.y() - radius < min_y) {
				object.out_of_bound("min_y");
			} else if (object.pos.y() + radius > max_y) {
				object.out_of_bound("max_y");
			}
		}
	}

	/**
	 * Manage Object to Objects collisions
	 * Calls their collision method if they collide with an object
	 * 
	 * @param {Array} objects 
	 */
	static object_to_object(objects) {
		for (const object1 of objects) {
			let near_object = this.get_near_objects(object1, 0, "space");

			for (const object2 of near_object) {
				object1.collision(object2);
			}
		}
	}
}