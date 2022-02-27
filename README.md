# Genetic Fighter

## Project Dependencies

* npm `sudo apt-get install npm`

## Setup

To setup the app:
```sh
make setup
```

If you are having trouble making npm work in wsl consider removing the npm proxy with `make npm-rm-proxy`

## Launching the app

To launch the app just open `index.html` in your browser

## Documentation

To generate the documentation:
```sh
make doc
```

After beeing generated the documentation will be in the `doc` folder

## Key Shortcuts

| Keys     |                                   Effects                                    |
| :------- | :--------------------------------------------------------------------------: |
| Space    |                       Pause / Unpause the application                        |
| Escape   |                            Stops the application                             |
| R        |                            Resets the application                            |
| S        |                  Save the generation & download it as JSON                   |
| L        | Load a generation stored in your computer (need to be the same JSON format)  |
| Numpad 0 | Swap between modes (generation by generation / update cycle by update cycle) |
