# CKEditor 4 WYSIWYG Editor Vue Integration Changelog

## ckeditor4-vue 1.4.0

Highlights:

Updated dependency [`ckeditor4-integrations-common@1.0.0`](https://www.npmjs.com/package/ckeditor4-integrations-common) does not contain Promise polyfill anymore. This is a possible breaking change for any downstream package that relies on it.

Note that `ckeditor4-vue` package already exposes two variants of the library (es6-compatible and a legacy one) and the polyfill will still be used to support the legacy version.

Other Changes:

* Updated [`ckeditor4-integrations-common`](https://www.npmjs.com/package/ckeditor4-integrations-common) package to `1.0.0` version.

## ckeditor4-vue 1.3.2

* Updated default CDN CKEditor 4 dependency to [4.16.2](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4162).

## ckeditor4-vue 1.3.1

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.16.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4161).

## ckeditor4-vue 1.3.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.16.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-416).
* Updated [`ckeditor4-integrations-common`](https://www.npmjs.com/package/ckeditor4-integrations-common) package to `0.2.0` version.
* Updated year in license headers.

## ckeditor4-vue 1.2.0

New Features:

* [#61](https://github.com/ckeditor/ckeditor4-vue/issues/61): Exposed `@namespaceloaded` event fired when [`CKEDITOR` namespace](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR.html) is loaded, which can be used for its easier customization.
* [#52](https://github.com/ckeditor/ckeditor4-vue/issues/52): Improved typing performance by adding [customizable throttling option](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_vue.html#throttle).

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.15.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4151).

## ckeditor4-vue 1.1.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.15.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-415).

## ckeditor4-vue 1.0.1

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.14.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4141).

## ckeditor4-vue 1.0.0

The first stable release of the CKEditor 4 WYSIWYG Editor Vue Integration. After a few months of the beta phase, testing and listening to community feedback, the CKEditor 4 Vue Integration is stable and can be used with full confidence. Enjoy!

Fixed Issues:

* [#32](https://github.com/ckeditor/ckeditor4-vue/issues/32): Fixed: Watchers may interrupt the editor initialization. Thanks to [Michael Babker](https://github.com/mbabker)!

## ckeditor4-vue 0.2.0

Other Changes:

* Updated the default CKEditor 4 CDN dependency to [4.14.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-414).

## ckeditor4-vue 0.1.0

The first beta release of CKEditor 4 WYSIWYG Editor Vue Integration.
