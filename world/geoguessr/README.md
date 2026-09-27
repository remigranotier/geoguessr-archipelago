# Apworld development

## Overview

The apworld file is what Archipelago will use to generate a game.
It is actually a folder containing python source code, but can be turned into a compressed .apworld file for convenience.
It describes all the locations, items, regions, rules of the game and handles parameters influencing the generation of the game.
Archipelago directly takes this folder as an input to generate a game, which means the code isn't meant to be ran by ourselves.

## Prerequisites

This project uses Python 3.13.11. It is recommended to use `direnv` for it. Before installing python with `pyenv install 3.13.11`, ensure to have necessary libs

```
sudo apt-get install build-essential libbz2-dev
```

Some other libs might be necessary.

You need to run Archipelago from source, **do not** use the exe client.
Clone the repo :
```bash
git clone git@github.com:ArchipelagoMW/Archipelago.git
```

Even though your code might be in your repository folder, you need it to be located in Archipelago's ``worlds`` folder to run it.
A solution for this is to create a symlink in ``Archipelago/worlds/`` to your work folder.
From ``Archipelago/worlds`` :
```bash
ln -s path/to/your/apworld/folder
```

Then, you can run any of the scripts located at the root of the Archipelago folder from your work environment (``Generate.py`` for example). This will let you install the necessary Archipelago dependencies.

## Development

You first need to generate template options for the apworld. For this, start the launcher (``Archipelago/Launcher.py``) and select the "Generate Template Options" button to generate a yaml file describing the game options in the folder ``Archipelago/Players/Templates``.

Then, put this file in the ``Archipelago/Players`` folder.
I suggest to run the Archipelago game generator (``Archipelago/Generate.py``). This will load the apworld, then generate a yaml file containing the options for our apworld.

To generate a multiplayer game, simply add yaml files in the Players folder before generating. These files can be from any game.
