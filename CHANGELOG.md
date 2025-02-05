# CKEditor 4 WYSIWYG Editor Vue Integration Changelog

⚠️️️ **CKEditor 4 (the open source edition) is no longer maintained.** ⚠️

If you would like to keep access to future CKEditor 4 security patches, check the [Extended Support Model](https://ckeditor.com/ckeditor-4-support/), which guarantees **security updates and critical bug fixes until December 2028**. Alternatively, [upgrade to CKEditor 5](https://ckeditor.com/docs/ckeditor5/latest/updating/ckeditor4/migration-from-ckeditor-4.html).

## ckeditor4-vue 3.2.1

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.25.1-lts](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4251-lts).
* Updated license headers to 2025.
* Updated readme files to reflect the new CKEditor 4 Extended Support Model end date.

Please note that this patch release doesn't provide any security fixes. It's a part of our administrative maintenance updates.

## ckeditor4-vue 3.2.0

⚠️️️ CKEditor 4 CDN dependency has been upgraded to the latest secure version. All editor versions below 4.25.0-lts can no longer be considered as secure! ⚠️

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.25.0-lts](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4250-lts).

## ckeditor4-vue 3.1.0

⚠️️️ CKEditor 4 CDN dependency has been upgraded to the latest secure version. All editor versions below 4.24.0-lts can no longer be considered as secure! ⚠️

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.24.0-lts](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4240-lts).

## ckeditor4-vue 3.0.0

This release introduces a support for the LTS (”Long Term Support”) version of the editor, available under commercial terms (["Extended Support Model"](https://ckeditor.com/ckeditor-4-support/)).

If you acquired the Extended Support Model for CKEditor 4 LTS, please read [the CKEditor 4 LTS key activation guide.](https://ckeditor.com/docs/ckeditor4/latest/support/licensing/license-key-and-activation.html)

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.23.0-lts](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4230-lts).

## ckeditor4-vue 2.4.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.22.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4220--4221).

## ckeditor4-vue 2.3.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.21.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4210).

## ckeditor4-vue 2.2.2

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.20.2](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4202).

## ckeditor4-vue 2.2.1

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.20.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4201).

## ckeditor4-vue 2.2.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.20](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-420).

## ckeditor4-vue 2.1.1

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.19.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4191).

## ckeditor4-vue 2.1.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.19.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4190).

## ckeditor4-vue 2.0.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.18.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4180).

	[Web Spell Checker](https://webspellchecker.com/) ended support for WebSpellChecker Dialog on December 31st, 2021. Therefore, this plugin has been deprecated and removed from the CKEditor 4.18.0 `standard-all` preset.
	We strongly encourage everyone to choose one of the other available spellchecking solutions - [Spell Check As You Type (SCAYT)](https://ckeditor.com/cke4/addon/scayt) or [WProofreader](https://ckeditor.com/cke4/addon/wproofreader).

## ckeditor4-vue 1.5.1

Other Changes:

* Updated year and company name in the license headers.
* Updated default CDN CKEditor 4 dependency to [4.17.2](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4172).

## ckeditor4-vue 1.5.0

New Features:

* [#102](https://github.com/ckeditor/ckeditor4-vue/issues/102): Added support for CKEditor 4 [Delayed Editor Creation](https://ckeditor.com/docs/ckeditor4/latest/features/delayed_creation.html) feature.

Other Changes:

* Updated year and company name in the license headers.

## ckeditor4-vue 1.4.0

Highlights:

Updated dependency [`ckeditor4-integrations-common@1.0.0`](https://www.npmjs.com/package/ckeditor4-integrations-common) does not contain Promise polyfill anymore. This is a possible breaking change for any downstream package that relies on it.

Note that `ckeditor4-vue` package already exposes two variants of the library (es6-compatible and a legacy one) and the polyfill will still be used to support the legacy version.

Fixed Issues:

* [#121](https://github.com/ckeditor/ckeditor4-vue/issues/121): Fixed: "Permission denied" in IE11. Thanks to [André Brás](https://github.com/whity)!

Other Changes:

* Updated [`ckeditor4-integrations-common`](https://www.npmjs.com/package/ckeditor4-integrations-common) package to `1.0.0` version.
* Updated default CDN CKEditor 4 dependency to [4.17.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4171).

## ckeditor4-vue 1.3.2

Other Changes:

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
