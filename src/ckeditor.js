/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global CKEDITOR */

import getEditorNamespace from './utils/get-editor-namespace.js';

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
			validator: type => type in { classic: 1, inline: 1 }
		},
		editorUrl: {
			type: String,
			default: 'https://cdn.ckeditor.com/4.11.4/standard/ckeditor.js'
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
			default: null // Use the null for default value, so `config.readOnly` can take precedence.
		}
	},

	mounted() {
		getEditorNamespace( this.editorUrl ).then( () => {
			const config = { ...this.config };

			// Overwrite config only if `component.readOnly` is set.
			if ( this.readOnly !== null ) {
				config.readOnly = this.readOnly;
			}

			const method = this.type === 'inline' ? 'inline' : 'replace';
			const element = this.$el.firstElementChild;
			const editor = this.instance = CKEDITOR[ method ]( element, config );

			editor.on( 'instanceReady', () => {
				const undo = editor.undoManager;
				const data = this.value;

				undo && undo.lock();

				editor.setData( data, { callback: () => {
					this.$_setUpEditorEvents();

					const newData = editor.getData();

					// Locking undoManager prevents 'change' event.
					// Trigger it manually to update bound data.
					if ( data !== newData ) {
						this.$once( 'input', () => {
							this.$emit( 'ready', editor );
						} );

						this.$emit( 'input', newData );
					} else {
						this.$emit( 'ready', editor );
					}

					undo && undo.unlock();
				} } );
			} );
		} );
	},

	beforeDestroy() {
		if ( this.instance ) {
			this.instance.destroy();
		}

		// Note: By the time the editor is destroyed (editor.on( 'destroy' ) called)
		// the Vue component will not be able to emit any longer. So emitting #destroy a bit earlier.
		this.$emit( 'destroy', this.instance );
	},

	watch: {
		value( val ) {
			if ( this.instance.getData() !== val ) {
				this.instance.setData( val );
			}
		},

		readOnly( val ) {
			this.instance.setReadOnly( val );
		}
	},

	methods: {
		$_setUpEditorEvents() {
			const editor = this.instance;

			editor.on( 'change', evt => {
				const data = editor.getData();

				// Editor#change event might be fired without actual data change.
				if ( this.value !== data ) {
					// The compatibility with the v-model and general Vue.js concept of input–like components.
					this.$emit( 'input', data, evt, editor );
				}
			} );

			editor.on( 'focus', evt => {
				this.$emit( 'focus', evt, editor );
			} );

			editor.on( 'blur', evt => {
				this.$emit( 'blur', evt, editor );
			} );
		}
	}
};
