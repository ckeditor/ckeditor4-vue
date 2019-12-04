# CKEditor 4 WYSIWYG editor component for Vue [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20CKEditor%204%20Vue%20integration&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fckeditor4-vue)

[![npm version](https://badge.fury.io/js/ckeditor4-vue.svg)](https://www.npmjs.com/package/ckeditor4-vue)
[![GitHub tag](https://img.shields.io/github/tag/ckeditor/ckeditor4-vue.svg)](https://github.com/ckeditor/ckeditor4-vue)

[![Build Status](https://travis-ci.org/ckeditor/ckeditor4-vue.svg?branch=master)](https://travis-ci.org/ckeditor/ckeditor4-vue)
[![Dependency Status](https://david-dm.org/ckeditor/ckeditor4-vue/status.svg)](https://david-dm.org/ckeditor/ckeditor4-vue)
[![devDependency Status](https://david-dm.org/ckeditor/ckeditor4-vue/dev-status.svg)](https://david-dm.org/ckeditor/ckeditor4-vue?type=dev)

[![Join newsletter](https://img.shields.io/badge/join-newsletter-00cc99.svg)](http://eepurl.com/c3zRPr)
[![Follow Twitter](https://img.shields.io/badge/follow-twitter-00cc99.svg)](https://twitter.com/ckeditor)

Official [CKEditor 4](https://ckeditor.com/ckeditor-4/) WYSIWYG editor component for Vue.

We are looking forward to your feedback! You can report any issues, ideas or feature requests on the [integration issues page](https://github.com/ckeditor/ckeditor4-vue/issues/new).

![CKEditor 4 screenshot](https://c.cksource.com/a/1/img/npm/ckeditor4.png)

## Usage

Use CKEditor4 Vue plugin by calling `Vue.use()` method:

```js
import Vue from 'vue';
import CKEditor from 'ckeditor4-vue';

Vue.use( CKEditor );

new Vue( {
	// ... options
} )
```

and then use the `<ckeditor>` component in your template:

```html
<template>
	<div id="app">
		<ckeditor value="Hello, World!"></ckeditor>
	</div>
</template>
```

## Documentation and examples

See the [CKEditor 4 WYSIWYG Editor Vue Integration](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_vue.html) article in the [CKEditor 4 documentation](https://ckeditor.com/docs/ckeditor4/latest).

You can also check out [CKEditor 4 WYSIWYG Editor Vue Integration example](https://ckeditor.com/docs/ckeditor4/latest/examples/vue.html) in [CKEditor 4 Examples](https://ckeditor.com/docs/ckeditor4/latest/examples/).

## Browser support

The CKEditor 4 Vue component works with all the [supported browsers](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_browsers.html#officially-supported-browsers) except for Internet Explorer.

To enable Internet Explorer 11 support, import specific `dist/legacy.js` file instead of standard import, containing all required polyfills:

`import CKEditor from 'ckeditor4-vue/dist/legacy.js'`

## Contributing

After cloning this repository, install necessary dependencies:

```
npm install
```

### Executing tests

```
npm run test
```

If you are going to change the source files (ones located in the `src/` directory), remember about rebuilding the package. You can use `npm run develop` in order to do it automatically.

### Building the package

Build a minified version of the package that is ready to publish:

```
npm run build
```

## License

Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.

Licensed under the terms of any of the following licenses at your
choice:

* [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html),
* [GNU Lesser General Public License Version 2.1 or later](http://www.gnu.org/licenses/lgpl.html),
* [Mozilla Public License Version 1.1 or later (the "MPL")](http://www.mozilla.org/MPL/MPL-1.1.html).

For full details about the license, please check the `LICENSE.md` file.
