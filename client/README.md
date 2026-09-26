# Client development

## Install

Clone this github repository

```
git clone git@github.com:remigranotier/geoguessr-archipelago.git
cd geoguessr-archipelago
```

Install npm with nvm (for example)
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh
nvm install --lts
```

Install dependencies
```
npm install
```

##  Run the development server

Run the dev server using

```
npm run dev:firefox
```

## Basic functioning of the client

The background script `background/index.ts` is the service-worker and is the "center" of the client. It communicates both with the `popup`, a small webpage which is rendered every time it is clicked on (but might not be rendered *all the time*), and with the `content` scripts, that are ran on the associated URLs set up.

The `geoguessr-game` content script is responsible of listening to events and stuff to "know" when a game is finished and the score set.

The `popup` allows the player to configure their connection. The connection to the archipelago servers is performed and kept in the `background` script.