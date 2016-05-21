# Polymer App Creation Kit

> Just add water and stir.

## Installation

`npm i -g gulp bower`

`npm i`

`bower i`

## Tasks

### Serve project from /src

`gulp`

### Run production build

`gulp build` 

### Serve project from /dist

`gulp serve:dist`

## Scaffolding

The following tasks are intended to make your life easier. 

### Change app name and do magic:

`gulp app:rename`

**Note**: generaly, you only should run this once after cloning this repo. 
Pay attention to that `package.json` is used to get your app name. 
By design, app name is used as a prefix for all your elements.

### Create new page:

`gulp app:page`

**Note**: you should then add new page to `pack-router` manually.

### Create new core element:

`gulp app:core`

**Note**: you should then include element test into `test/setup.html`.

## Linting

### Run all lint tasks in parallel

`npm run lint -s`

### Run JavaScript lint

`npm run lint:js -s`

### Run HTML hint

`npm run lint:html -s`

## Testing

### Run tests in Chrome, open coverage report

`npm test`

### Run tests in Chrome and Firefox, open coverage report

`npm run test:all`
