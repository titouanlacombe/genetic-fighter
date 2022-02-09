class Framework {
    constructor() {
        // Private
        this.last_request_id = 0; // Last request of requestAnimationFrame
        this.running = false; // If false stops the loops

        // Public
        // Dimentions of the canvas
        this.width = 0;
        this.height = 0;
        this.frames = 0; // Number of frames displayed since the start
        this.time = 0; // Time since the start
        this.dt = 0; // Delta time between last 2 frames
        this.average_fps = 0;

        // App
        this.app = null;

        // Key shortcuts
        // Reseting the app
        this.link_event('keydown', (e) => {
            if (e.code == "KeyR") {
                this.stop();
                this.launch();
            }
        });

        // Link canvas resize
        window.addEventListener('resize', this.app_resize);
    }

    start(app) {
        this.app = app;

        // Wait for the window to be fully loaded and launch the app
        window.requestAnimationFrame(() => { this.launch(); });
    }

    // Init & Launch the app
    launch() {
        // Init framework
        this.running = true;
        this.app_resize();

        // Init the app
        this.app.initing();

        // Start the loop
        this.last_request_id = window.requestAnimationFrame((_new_time) => { this.loop(_new_time); });
    }

    stop() {
        window.cancelAnimationFrame(this.last_request_id);
        this.running = false;

        this.app.exiting();
    }

    loop(new_time) {
        // Update some vars
        this.dt = (new_time - this.time);
        this.time = new_time;

        this.frames++;
        this.average_fps += (this.fps() - this.average_fps) / this.frames;

        // console.log("fps: ", this.fps());
        // console.log("frame: ", this.frames);

        // Call the app
        this.app.update(this.dt);

        // Call next loop if still running
        if (this.running) {
            this.last_request_id = window.requestAnimationFrame((_new_time) => { this.loop(_new_time); });
        }
    }

    fps() {
        return 1000 / this.dt;
    }

    get_renderer() {
        return document.getElementById('canvas').getContext('2d');
    }

    link_event(event, callback) {
        document.addEventListener(event, callback);
    }

    // Callback to update the canvas size
    app_resize() {
        let canvas = document.getElementById('canvas');

        // Update the canvas size
        this.width = canvas.width = canvas.parentElement.offsetWidth;
        this.height = canvas.height = canvas.parentElement.offsetHeight;

        // console.log(this.width, this.height);
    }
}

let framework = new Framework();
