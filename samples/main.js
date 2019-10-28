/* global Vue VueRouter CKEditor */

Vue.use( CKEditor );

const EditorTypesComponent = {
	name: 'editor-types',
	template: '#editor-types',
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

const eventMessages = {
	ready: 'Editor is ready',
	focus: 'Editor is focused',
	blur: 'Editor is blurred',
	input: 'Editor has changed'
};

const EventsPropagationComponent = {
	name: 'component-events',
	template: '#component-events',
	data: () => ( {
		editorData: 'Check out component events.',
		events: []
	} ),
	methods: {
		logEvent( event ) {
			const previous = this.events[ 0 ];
			const message = eventMessages[ event ];

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

const TwoWayBindingComponent = {
	name: 'data-binding',
	template: '#data-binding',
	data: () => ( {
		editorData: 'Check out how two-way data binding works.'
	} )
};

Vue.component( 'types', EditorTypesComponent );
Vue.component( 'events', EventsPropagationComponent );
Vue.component( 'binding', TwoWayBindingComponent );

const routes = [
	{
		path: '/types',
		component: EditorTypesComponent
	}, {
		path: '/events',
		component: EventsPropagationComponent
	}, {
		path: '/binding',
		component: TwoWayBindingComponent
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
