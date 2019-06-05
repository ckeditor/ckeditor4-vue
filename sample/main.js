/* global Vue VueRouter CKEditor */

Vue.use( CKEditor );

const types = {
	name: 'types',
	template: '#types',
	data: () => ( {
		readOnly: false,
		hide: false,
		show: true,
		editors: {
			classic: 'Classic editor',
			inline: 'Inline editor'
		}
	} )
};

const events = {
	name: 'events',
	template: '#events',
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
