const testEditor = {
	on: addListener(),
	once: addListener( true ),
	fire( evtName, evt ) {
		this._listeners = this._listeners[ evtName ].filter( ( { listener, once } ) => {
			listener( evt );
			return !once;
		} );
},
	_listeners: {},
	destroy() {}
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
