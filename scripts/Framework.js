/**
 * Framework of the application
 * Is the bridge between the application and the HTML/JS environement
 */
class Framework {
    /**
     * @constructor
     */
    constructor() {
        // Private
        /** Last request of requestAnimationFrame */
        this.last_request_id = 0;

        // Public
        /** Dimentions of the canvas */
        this.width = 0; this.height = 0;
        /** Number of frames displayed since the start */
        this.frames = 0;
        /** Seconds since the start */
        this.time = 0;
        /** Seconds between last 2 frames */
        this.dt = 0;
        /** Average frames per seconds */
        this.average_fps = 0;

        /** Application */
        this.app = null;

        // Key shortcut to reset the app
        this.link_event('keydown', (e) => {
            if (e.code == "KeyR") {
                this.stop();
                this.launch();
            }
        });

        // Link canvas resize event
        window.addEventListener('resize', this.app_resize);
    }

    /**
     * Start an application
     * @param {Application} app 
     */
    start(app) {
        this.app = app;

        // Wait for the window to be fully loaded and launch the app
        window.requestAnimationFrame(() => { this.launch(); });
    }

    /**
     * Init the framework, the application & enters the app loop
     * @param {Application} app 
     */
    launch() {
        // Init framework
        this.app_resize();

        // Init the app
        this.app.initing();

        // Start the loop
        this.last_request_id = window.requestAnimationFrame((_new_time) => { this.loop(_new_time); });
    }

    /**
     * Stops the app, the framework
     */
    stop() {
        window.cancelAnimationFrame(this.last_request_id);
        this.app.exiting();
    }

    /**
     * Framework loop
     * Proccess time & frames variables
     * Then call the app loop
     * @param {Number} new_time 
     */
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

        // Call next loop if app still running
        if (this.app.running) {
            this.last_request_id = window.requestAnimationFrame((_new_time) => { this.loop(_new_time); });
        }
        else {
            this.stop();
        }
    }

    /**
     * Returns the current frame fps
     * @returns {Number} Current fps
     */
    fps() {
        return 1000 / this.dt;
    }

    /**
     * Return the JS/HTML context renderer
     * @returns {Renderer}
     */
    get_renderer() {
        return document.getElementById('canvas').getContext('2d');
    }

    /**
     * Provide a language agnostic function to link to a event
     * @param {String} event 
     * @param {CallableFunction} callback 
     */
    link_event(event, callback) {
        document.addEventListener(event, callback);
    }

    /**
     * Update the app size vars with the new HTML canvas size
     */
    app_resize() {
        let canvas = document.getElementById('canvas');

        // Update the canvas size
        this.width = canvas.width = canvas.parentElement.offsetWidth;
        this.height = canvas.height = canvas.parentElement.offsetHeight;

        // console.log(this.width, this.height);
    }
}

let framework = new Framework();
