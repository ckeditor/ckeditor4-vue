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
	_listeners: {},
	destroy() {
		this._listeners = {};
	}
};

export default {
	replace: createEditor,
	inline: createEditor,
	testEditor
};

function createEditor() {
	return testEditor;
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
