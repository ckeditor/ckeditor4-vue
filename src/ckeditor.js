/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global CKEDITOR */

import { getEditorNamespace } from './helpers.js';

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

	readOnly() {
		return this.readOnly === null
			? this.instance.readOnly
			: this.readOnly;
	},

	beforeCreate() {
		this.$_ready = new Promise( res => {
			this.$once( 'ready', res );
		} );
	},

	mounted() {
		getEditorNamespace( this.editorUrl ).then( () => {
			const editor = this.instance =
				CKEDITOR[ this.type === 'inline' ? 'inline' : 'replace' ]( this.$el.firstElementChild, this.config );

			editor.on( 'instanceReady', () => {
				if ( this.readOnly !== null ) {
					this.instance.setReadOnly( this.readOnly );
				}

				const undo = editor.undoManager;
				const data = this.value;

				undo && undo.lock();

				editor.once( 'dataReady', () => {
					this.$_setUpEditorEvents();

					// Locking undoManager prevents 'change' event.
					// Trigger it manually to update bound data.
					if ( data !== editor.getData() ) {
						editor.once( 'change', () => {
							this.$emit( 'ready', editor );
						} );

						editor.fire( 'change' );
					} else {
						this.$emit( 'ready', editor );
					}

					undo && undo.unlock();
				} );

				editor.setData( data );
			} );
		} );
	},

	beforeDestroy() {
		this.destroyEditor();

		// Note: By the time the editor is destroyed (editor.on( 'destroy' ) called)
		// the Vue component will not be able to emit any longer. So emitting #destroy a bit earlier.
		this.$emit( 'destroy', this.instance );
	},

	watch: {
		value( val ) {
			if ( this.instance && this.instance.getData() !== val ) {
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

				// The compatibility with the v-model and general Vue.js concept of input–like components.
				this.$emit( 'input', data, evt, editor );
			} );

			editor.on( 'focus', evt => {
				this.$emit( 'focus', evt, editor );
			} );

			editor.on( 'blur', evt => {
				this.$emit( 'blur', evt, editor );
			} );
		},

		destroyEditor() {
			if ( this.instance ) {
				return this.$_ready.then( () => new Promise( res => {
					if ( this.instance ) {
						this.instance.on( 'destroy', res );
						this.instance.destroy();
						this.instance = null;
					} else {
						res();
					}
				} ) );
			}
			return Promise.resolve();
		}
	}
};
