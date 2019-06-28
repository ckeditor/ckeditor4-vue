# CKEditor 4 WYSIWYG editor Vue component
The official [CKEditor 4](https://ckeditor.com/ckeditor-4/) WYSIWYG editor component for Vue.

## Quick start

In order to create an editor instance in Vue, install the `ckeditor4-vue` npm package as a dependency of your project:

```bash
npm install --save ckeditor4-vue
```

Include the `<script>` tags for the WYSIWYG editor component and the build:

```html
<script src="../node_modules/@ckeditor/ckeditor5-vue/dist/ckeditor.js"></script>
```

Enable the component in your application by using the `Vue.use()` method:

```js
Vue.use( CKEditor );
```

Use the `<ckeditor>` component in your template:

- The `v-model` attribute enables an out–of–the–box two–way data binding.
- The `config` attribute lets you pass the configuration to the editor instance.

## Contributing

Here is how you can contribute to the development of the component. Any feedback and help will be most appreciated!

### Reporting issues and feature requests

All issues and feature requests should be reported in the [issues section](https://github.com/ckeditor/ckeditor4-vue/issues/new) of the official GitHub repository for the CKEditor 4 Angular integration.

### Development

Clone the [CKEditor 4 Angular integration repository](https://github.com/ckeditor/ckeditor4-angular).

Once you have cloned it, install dependencies by running:

```bash
npm install
```

#### The structure of the repository

This repository contains the following code:

* `./src/` contains the CKEditor component.
* `./dist/` your build will go here.
* `./sample/` is a demo application using the component. It requires build in `./dist/`.
* `./tests/` tests for the component.

#### Building samples

Run `npm build` to build the samples. The build artifacts will be stored in the `samples/` directory.

#### Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).
You can run tests with additional options:
- `--url` (`-u`) - Url to `ckeditor.js` when you want to use other version than default.
- `--watch` (`-w`) - Whether should watch changes in files.
- `--source-map` (`-s`) - Whether to generate source maps.
- `--browsers` (`-b`) - Comma separated browsers in which tests will be run.
- `--coverage` (`-c`) - Whether to generate coverage report.
- `--reporter` (`-r`) - Reporter for Karma to be used for tests output.

Example
```bash
npm run test -- -u url/to/ckeditor.js -w -s -b Firefox,Chrome
```

## License

Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.

For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
