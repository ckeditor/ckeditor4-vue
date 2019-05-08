/* global setTimeout */

const testEditor = {
	on: addListener(),

	once: addListener( true ),

	fire( evtName, evt ) {
		const listeners = this._listeners[ evtName ];

		if ( !listeners ) {
			return;
		}

		this._listeners[ evtName ] = listeners.filter( ( { callback, once } ) => {
			callback( evt );
			return !once;
		} );
	},

	setData() {},

	getData() {
		return '';
	},

	setReadOnly() {
	},

	destroy() {
		this.fire( 'destroy' );
		this._listeners = {};
	}
};

export default {
	replace: createEditor,
	inline: createEditor
};

function createEditor() {
	const instance = {
		...testEditor,
		_listeners: {}
	};

	// Make it async, otherwise listeners can't be added before returning editor isntance.
	setTimeout( () => {
		instance.fire( 'instanceReady' );
		instance.fire( 'dataReady' );
	} );

	return instance;
}

function addListener( once ) {
	return function( evtName, callback ) {
		if ( this._listeners[ evtName ] ) {
			this._listeners[ evtName ].push( { callback, once } );
		} else {
			this._listeners[ evtName ] = [ { callback, once } ];
		}
	};
}
