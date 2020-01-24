# BaseBuilder

BaseBuilder is a Webpack config in the form of an NPM module that can handle most WP projects.
Works best in combination with [BasePlate](https://github.com/Levdbas/BasePlate 'Check out BasePlate') WP starter theme

## How to install

### 1. Remove old devDependencies from your projects `package.json` file.

### 2. Add basebuilder

```bash
yarn add basebuilder-config
```

### 3. Add following scripts to package.json

```json
"scripts": {
    "dev": "npm run development",
    "development": "basebuilder-config development",
    "watch": "basebuilder-config watch",
    "production": "basebuilder-config production"
},
```

### 4. Make sure the following file exist: `resources/assets/config.json`

An example config file is located in `node_modules/basebuilder-config/config.json`

## How to eject

We'll probably make an eject script in the future. For now. Do the following steps:

1. add packages from `basebuilder-config/package.json` to your own `package.json`.

2. add the following scripts to your `package.json`.

```json
    "scripts": {
        "dev": "npm run development",
        "development": "NODE_ENV=development webpack --mode development --config assets/build/webpack.config.js",
        "watch": "NODE_ENV=development webpack --mode development --watch --config assets/build/webpack.config.js",
        "production": "NODE_ENV=production webpack --mode production --config assets/build/webpack.config.js"
    },
```

3. copy `basebuilder-config/build` folder to your projects assets folder in the project root.

## Overwrite config.json file location

Normally BaseBuilder checks for the config.json in the assets folder in the root of the project dir.
If you want to overwrite it you can set

```json
   "config": {
        "userConfig": "/web/app/themes/yourtheme/resources/assets/config.json"
    },
```

in the package.json.

## Changelog starting at 0.5

### 0.6.2

-   Update config to work with package.json in root of project and in theme folder.
-   Starting changelog in readme.md
-   Dependency update

### 0.6.1

-   Update watch locations for browsersync

### 0.6.0

-   New: option to overwrite theme path in the package.json
-   Fixing line endings
-   Readme update

### 0.5.2

-   Fix: change line endings to work with linux/mac.

### 0.5.1

-   Package bump
-   Update watch locations for browsersync

### 0.5.0

-   Update to the way HMR packages are located.
