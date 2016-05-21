# Polymer App Creation Kit

A lightweight alternative to [Polymer Starter Kit](https://github.com/PolymerElements/polymer-starter-kit).

> Just add water and stir.

### Features

&nbsp; &nbsp; ✓ Basic page layout using brand new [app-layout](https://elements.polymer-project.org/elements/app-layout)<br>
&nbsp; &nbsp; ✓ Powerful routing using plain old [app-router](https://github.com/erikringsmuth/app-router) and [pushstate-anchor](https://github.com/erikringsmuth/pushstate-anchor)<br>
&nbsp; &nbsp; ✓ Vulcanize configuration using [web-component-shards](https://github.com/PolymerLabs/web-component-shards) for separate page bundles<br>
&nbsp; &nbsp; ✓ Pre-configured [local-web-server](https://github.com/75lb/local-web-server) with support for mocks, url rewrites and more<br>
&nbsp; &nbsp; ✓ Linting inline scripts with [ESLint](http://eslint.org) and elements markup with [HTMLHint](https://github.com/yaniswang/HTMLHint)<br>
&nbsp; &nbsp; ✓ Unit tests with [WCT](https://github.com/Polymer/web-component-tester), including [Istanbul](https://github.com/thedeeno/web-component-tester-istanbul) plugin for coverage<br>
&nbsp; &nbsp; ✓ Scaffolding tasks for easy elements creation using [Lo-Dash templates](https://lodash.com/docs#template)<br>
&nbsp; &nbsp; ✓ Simple and elegant project reset using [renamer](https://github.com/75lb/renamer)<br>

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

**Note**: generaly, you only should run this once after cloning this repo.<br>
Pay attention to that `package.json` is used to get your app name.<br>
By design, app name is also used as a prefix for all your elements.

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
