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
