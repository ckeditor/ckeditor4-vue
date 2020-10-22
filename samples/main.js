/* global Vue VueRouter CKEditor */
/* eslint-disable */

Vue.use( CKEditor );

var defaultMixin = {
	methods: {
		namespaceLoaded: function( namespace ) {
			console.log( 'CKEDITOR version: ', namespace.version );
		}
	}
};

var EditorTypesComponent = {
	name: 'editor-types',
	template: '#editor-types',
	mixins: [ defaultMixin ],
	data: function(){
		return {
			readOnly: false,
			hide: false,
			show: true,
			editors: {
				classic: 'Classic editor',
				inline: 'Inline editor'
			}
		};
	}
},
eventMessages = {
	ready: 'Editor is ready',
	focus: 'Editor is focused',
	blur: 'Editor is blurred',
	input: 'Editor has changed'
},
EventLoggerComponent = {
	name: 'component-events',
	template: '#component-events',
	mixins: [ defaultMixin ],
	data: function() {
		return {
			editorData: 'Check out component events.',
			events: []
		};
	},
	methods: {
		logEvent: function( event ) {
			var previous = this.events[ 0 ];
			var message = eventMessages[ event ];

			if ( previous && event === previous.name ) {
				previous.counter++;

				var count = previous.counter > 1 ? ' (' + previous.counter + ')' : '';

				previous.message = message + count;
			} else {
				if ( this.events.length > 19 ) {
					this.events.pop();
				}

				this.events.unshift( {
					name: event,
					counter: 1,
					message: message
				} );
			}
		}
	}
};

var TwoWayBindingComponent = {
	name: 'data-binding',
	template: '#data-binding',
	mixins: [ defaultMixin ],
	data: function() {
		return {
			editorData: 'Check out how two-way data binding works.'
		};
	}
};

var routes = [
	{
		path: '/types',
		component: EditorTypesComponent
	}, {
		path: '/events',
		component: EventLoggerComponent
	}, {
		path: '/binding',
		component: TwoWayBindingComponent
	},
	{
		path: '*',
		redirect: '/types'
	}
];

var router = new VueRouter( { routes: routes } );

new Vue( {
	el: '#app',
	router: router
} );
