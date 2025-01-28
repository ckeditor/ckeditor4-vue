/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global CKEDITOR */

import { debounce, getEditorNamespace } from 'ckeditor4-integrations-common';

export default {
	name: 'ckeditor',

	render( createElement ) {
		return createElement( 'div', {}, [
			createElement( this.tagName )
		] );
	},

	props: {
		value: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: 'classic',
			validator: type => [ 'classic', 'inline' ].includes( type )
		},
		editorUrl: {
			type: String,
			default: 'https://cdn.ckeditor.com/4.25.0-lts/standard-all/ckeditor.js'
		},
		config: {
			type: Object,
			default: () => {}
		},
		tagName: {
			type: String,
			default: 'textarea'
		},
		readOnly: {
			type: Boolean,
			default: null // Use null as the default value, so `config.readOnly` can take precedence.
		},
		throttle: {
			type: Number,
			default: 80
		}
	},

	mounted() {
		getEditorNamespace( this.editorUrl, namespace => {
			this.$emit( 'namespaceloaded', namespace );
		} ).then( () => {
			if ( this.$_destroyed ) {
				return;
			}

			const config = this.prepareConfig();
			const method = this.type === 'inline' ? 'inline' : 'replace';
			const element = this.$el.firstElementChild;

			CKEDITOR[ method ]( element, config );
		} );
	},

	beforeDestroy() {
		if ( this.instance ) {
			this.instance.destroy();
		}

		this.$_destroyed = true;
	},

	watch: {
		value( val ) {
			if ( this.instance && this.instance.getData() !== val ) {
				this.instance.setData( val );
			}
		},

		readOnly( val ) {
			if ( this.instance ) {
				this.instance.setReadOnly( val );
			}
		}
	},

	methods: {
		prepareConfig() {
			const config = this.config || {};
			config.on = config.on || {};

			if ( config.delayIfDetached === undefined ) {
				config.delayIfDetached = true;
			}
			if ( this.readOnly !== null ) {
				config.readOnly = this.readOnly;
			}

			const userInstanceReadyCallback = config.on.instanceReady;

			config.on.instanceReady = evt => {
				this.instance = evt.editor;

				this.$nextTick().then( () => {
					this.prepareComponentData();

					if ( userInstanceReadyCallback ) {
						userInstanceReadyCallback( evt );
					}
				} );
			};

			return config;
		},
		prepareComponentData() {
			const data = this.value;

			this.instance.fire( 'lockSnapshot' );

			this.instance.setData( data, { callback: () => {
				this.$_setUpEditorEvents();

				const newData = this.instance.getData();

				// Locking the snapshot prevents the 'change' event.
				// Trigger it manually to update the bound data.
				if ( data !== newData ) {
					this.$once( 'input', () => {
						this.$emit( 'ready', this.instance );
					} );

					this.$emit( 'input', newData );
				} else {
					this.$emit( 'ready', this.instance );
				}

				this.instance.fire( 'unlockSnapshot' );
			} } );
		},
		$_setUpEditorEvents() {
			const editor = this.instance;

			const onChange = debounce( evt => {
				const data = editor.getData();

				// Editor#change event might be fired without an actual data change.
				if ( this.value !== data ) {
					// The compatibility with the v-model and general Vue.js concept of input–like components.
					this.$emit( 'input', data, evt, editor );
				}
			}, this.throttle );

			editor.on( 'change', onChange );

			editor.on( 'focus', evt => {
				this.$emit( 'focus', evt, editor );
			} );

			editor.on( 'blur', evt => {
				this.$emit( 'blur', evt, editor );
			} );
		}
	}
};
