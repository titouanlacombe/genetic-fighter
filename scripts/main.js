// Launch application
framework = new Framework();
evolver = new EvolveApp();
evolver.target_generation = 1;
evolver.generation_size = 5;
framework.start(evolver);
