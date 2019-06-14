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
			const messages = {
				ready: 'Editor is ready',
				focus: 'Editor is focused',
				blur: 'Editor is blurred',
				input: 'Editor has changed'
			};
			const message = messages[ event ];

			if ( previous && event === previous.name ) {
				previous.counter++;

				const count = previous.counter > 1 ? ` (${ previous.counter })` : '';

				previous.message = message + count;
			} else {
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

const router = new VueRouter( { routes } );

/* eslint no-new: 0 */

new Vue( {
	el: '#app',
	router
} );
