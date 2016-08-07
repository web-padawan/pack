# Polymer App Creation Kit

Pack is a lightweight alternative to [Polymer Starter Kit](https://github.com/PolymerElements/polymer-starter-kit) and [App Toolbox](https://www.polymer-project.org/1.0/toolbox/).

> Just add water and stir.

### Features

&nbsp; &nbsp; ✓ Basic page layout using brand new [app-layout](https://elements.polymer-project.org/elements/app-layout)<br>
&nbsp; &nbsp; ✓ Powerful routing using plain old [app-router](https://github.com/erikringsmuth/app-router) and [pushstate-anchor](https://github.com/erikringsmuth/pushstate-anchor)<br>
&nbsp; &nbsp; ✓ Vulcanize configuration using [web-component-shards](https://github.com/PolymerLabs/web-component-shards) for separate page bundles<br>
&nbsp; &nbsp; ✓ Pre-configured [local-web-server](https://github.com/75lb/local-web-server) with support for mocks, url rewrites and more<br>
&nbsp; &nbsp; ✓ Linting inline scripts with [ESLint](http://eslint.org), including a [Google](https://github.com/google/eslint-config-google) config<br>
&nbsp; &nbsp; ✓ Linting inline styles with [Stylelint](https://github.com/stylelint/stylelint), including a [standard](https://github.com/stylelint/stylelint-config-standard) config<br>
&nbsp; &nbsp; ✓ Linting elements markup with [HTMLHint](https://github.com/yaniswang/HTMLHint)<br>
&nbsp; &nbsp; ✓ Unit tests with [WCT](https://github.com/Polymer/web-component-tester), including [Istanbul](https://github.com/thedeeno/web-component-tester-istanbul) plugin for coverage<br>
&nbsp; &nbsp; ✓ Transpiling ES2015 with [Babel](https://babeljs.io)<br>
&nbsp; &nbsp; ✓ Scaffolding tasks for easy elements creation using [Lo-Dash templates](https://lodash.com/docs#template)<br>
&nbsp; &nbsp; ✓ Simple and elegant project reset using [renamer](https://github.com/75lb/renamer)<br>

## Setup

```
npm i -g gulp bower
```

```
npm i
```

```
bower i
```

## General tasks

#### Serve project from /src

```
gulp
```

#### Run production build

```
gulp build
```

#### Serve project from /dist

```
npm start
```

## Project structure

Pack keeps components in separate directories.

```
src/
|
|-- components/             # Custom elements and behaviors
|   |-- app/
|   |   |-- pack-app/       # Root endpoint required by index.html
|   |
|   |-- core/               # Smart components for app logic. They all should have tests
|   |   |-- pack-router/    # Wrapper component. Contains list of project routes
|   |   ...
|   |
|   |-- layout/             # Layout components, used on different pages
|   |   |-- pack-layout/    # Wrapper component. Contains layout skeleton
|   |   |-- pack-menu/      # Menu component built with some Paper Elements
|   |   ...
|   |
|   |-- pages/              # Page endpoints, lazy loaded by router
|   |
|   |-- shared/             # Reusable dummy components
|   ...
|
|-- styles/                 # Common style modules
|   |-- shared-styles.html  # Root style module shared between index.html and components
|   |-- normalize.html      # Normalize CSS
|   |-- mixins.html         # Shared mixins
|   |-- variables.html      # Shared variables
|   ...
|
`-- vendor/                 # Bower components
    |-- polymer/            # Polymer library
    |-- app-layout/         # Basic layout components
    |-- app-router/         # Router component
    ...
```

#### Notes

* bower components directory (here called `vendor`) must be placed into `src` to resolve imports by vulcanize
* so, if you want to place `vendor` directory at project root, please create a symlink into `src`
* pay attention to components marked as **endpoints**: those are passed to [web-component-shards](https://github.com/PolymerLabs/web-component-shards)

## Scaffolding

Pack is designed to make your life easier.

#### Change app name and do magic:

```
gulp pack:rename
```

**Note**: generaly, you only should run this once after cloning this repo.<br>
Pay attention to that `package.json` is used to get your app name.<br>
By design, app name is also used as a prefix for all your elements.

#### Create new page:

```
gulp pack:page
```

**Note**: you should then add new page to `pack-router` manually.

#### Create new core element:

```
gulp pack:core
```

**Note**: you should then include element test into `test/setup.html`.

## Linting

#### Run all lint tasks in parallel

```
npm run lint -s
```

#### Run JavaScript lint

```
npm run lint:js -s
```

#### Run HTML hint

```
npm run lint:html -s
```

#### Run stylelint

```
npm run lint:css -s
```

**Note**: only use `-s` flag locally if you don't need `npm-debug.log`

## Testing

#### Run tests in Chrome:

```
npm test
```

#### Run tests in Chrome and Firefox:

```
npm run test:all
```

**Note**: coverage report is opened only if your coverage exceeds required threshold.

## FAQ

#### Why not using App Toolbox?

Pack is designed to take full control over build process.

#### Why app-router?

Pack uses it for several reasons:

* plain old library agnostic web component
* compatible with Polymer 1.6
* powerful [configuration](https://erikringsmuth.github.io/app-router/#/api)
* useful [lifecycle events](https://erikringsmuth.github.io/app-router/#/events)
* great support for [data binding](https://erikringsmuth.github.io/app-router/#/databinding/test)
* easy redirects
* manual initialization

Please let me know when official [app-route](https://elements.polymer-project.org/elements/app-route) will implement all this stuff :)

#### Why web-component-shards?

Actually this tool is not designed for SPA, but for web apps having multiple endpoints :)<br>
But using `wcs` is the only way to split vulcanized app into several bundles.<br>
At least `pack-app` bundle is unlikely to change very often and so may be cached.<br>
Separate pages are all different bundles which are lazy loaded.

## Known issues

* Pack is not designed to run from subfolder on `gh-pages`. I'm going to have a look at this later.<br>
* Anyway, routing in that case is likely to be available only in `hash` mode.<br>
* Before running `pack:rename` please make sure that you don't have some files opened in your IDE.<br>
Leaving them opened might break magic of `renamer` (at least in Sublime).<br>
* For transpiling ES2015, [es2015-without-strict](https://github.com/fancyboynet/babel-preset-es2015-without-strict) preset is used.<br>
The reason is a bug in [web-animations-next-lite.min.js](https://github.com/web-animations/web-animations-next/issues/402) used by `neon-animated-pages`. It doesn't work in strict mode.<br>

For any ideas, feel free to email me at [serguey.kulikov@gmail.com](mailto:serguey.kulikov@gmail.com)
