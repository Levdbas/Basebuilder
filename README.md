# BaseBuilder

BaseBuilder is a Webpack config in the form of an NPM module that can handle most WP projects.

## How to install

### 1. Remove old devDependencies from your projects ```package.json``` file.

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

### 4. Make sure the following file exist: ```resources/assets/config.json```
