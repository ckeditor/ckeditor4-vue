/* global Vue VueRouter CKEditor */

Vue.use( CKEditor );

const types = {
	name: 'types',
	template: '#types',
	beforeRouteLeave( to, from, next ) {
		destroyEditors( this, [
			'classic',
			'inline'
		] ).then( next );
	},
	data: () => ( {
		readOnly: false,
		hide: false,
		show: true,
		editors: {
			classic: {
				data: 'Classic editor'
			},
			inline: {
				data: 'Inline editor'
			}
		}
	} ),
	methods: {
		toggleHide( event ) {
			if ( event.target.checked ) {
				destroyEditors( this, [
					'classic',
					'inline'
				] ).then( () => {
					this.hide = true;
				} );
			} else {
				this.hide = false;
			}
		}
	}
};

const events = {
	name: 'events',
	template: '#events',
	beforeRouteLeave( to, from, next ) {
		destroyEditors( this, [ 'classic' ] ).then( next );
	},
	data: () => ( {
		editorData: 'Check out component events.',
		events: []
	} ),
	methods: {
		logEvent( event ) {
			const previous = this.events[ 0 ];

			if ( previous && event === previous.name ) {
				previous.counter++;
			} else {
				let message;

				switch ( event ) {
					case 'ready':
						message = 'Editor is ready';
						break;
					case 'focus':
						message = 'Editor is focused';
						break;
					case 'blur':
						message = 'Editor is blurred';
						break;
					case 'input':
						message = 'Editor has changed';
				}

				if ( this.events.length > 19 ) {
					this.events.pop();
				}

				this.events.unshift( {
					name: event,
					counter: 1,
					message
				} );
			}
		}
	}
};

const binding = {
	name: 'binding',
	template: '#binding',
	beforeRouteLeave( to, from, next ) {
		destroyEditors( this, [ 'classic' ] ).then( next );
	},
	data: () => ( {
		editorData: 'Check out how two-way data binding works.'
	} )
};

Vue.component( 'types', types );
Vue.component( 'events', events );
Vue.component( 'binding', binding );

const routes = [
	{
		path: '/types',
		component: types
	}, {
		path: '/events',
		component: events
	}, {
		path: '/binding',
		component: binding
	},
	{
		path: '*',
		redirect: '/types'
	}
];

const router = new VueRouter( {
	routes,
} );

/* eslint no-new: 0 */

new Vue( {
	el: '#app',
	router
} );

function destroyEditors( component, editorNames ) {
	return Promise.all( editorNames.map( name => component.$refs[ name ].destroyEditor() ) );
}
