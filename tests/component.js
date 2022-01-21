/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// VTU use entries, which fails for IE11
import 'core-js/es/object/entries';
import sinon from 'sinon';
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import { getEditorNamespace } from 'ckeditor4-integrations-common';
import CKEditorComponent from '../src/ckeditor';
import { delay, deleteCkeditorScripts } from './utils';

/* global window, document */

describe( 'CKEditor Component', () => {
	const CKEditorNamespace = window.CKEDITOR;

	let skipReady = false;
	let sandbox, wrapper, component, props;

	beforeEach( done => {
		sandbox = sinon.createSandbox();
		wrapper = createComponent( props );
		component = wrapper.vm;

		sandbox.spy( CKEditorNamespace, 'replace' );
		sandbox.spy( CKEditorNamespace, 'inline' );

		if ( skipReady ) {
			done();
		} else {
			component.$once( 'ready', () => {
				done();
			} );
		}
	} );

	afterEach( () => {
		skipReady = false;

		wrapper.destroy();
		sandbox.restore();
	} );

	after( () => {
		window.CKEDITOR = CKEditorNamespace;
	} );

	describe( 'initialization', () => {
		it( 'component should have a name', () => {
			expect( CKEditorComponent.name ).to.equal( 'ckeditor' );
		} );

		it( 'should render', () => {
			expect( wrapper.html() ).to.not.be.empty;
		} );

		describe( 'property', () => {
			[ {
				property: 'value',
				defaultValue: ''
			}, {
				property: 'type',
				defaultValue: 'classic'
			}, {
				property: 'editorUrl',
				defaultValueRegex: /https:\/\/cdn\.ckeditor\.com\/4\.\d{1,2}\.\d{1,2}\/(standard|basic|full)(-all)?\/ckeditor\.js/
			}, {
				property: 'config',
				defaultValue: undefined
			}, {
				property: 'throttle',
				defaultValue: 80
			}, {
			}, {
				property: 'tagName',
				defaultValue: 'textarea'
			}, {
				property: 'readOnly',
				defaultValue: null
			} ].forEach( ( { property, defaultValue, defaultValueRegex } ) => {
				it( `"${ property }" should have default value`, () => {
					if ( defaultValue ) {
						expect( component[ property ] ).to.equal( defaultValue );
					}

					if ( defaultValueRegex ) {
						expect( component[ property ] ).to.match( defaultValueRegex );
					}
				} );
			} );
		} );

		// Repeat description, so test are nicely grouped in the output,
		// but keep them separate in code, because they need different setup.
		describe( 'property', () => {
			[ {
				property: 'value',
				value: 'foo'
			}, {
				property: 'type',
				value: 'inline'
			}, {
				property: 'editorUrl',
				value: 'https://cdn.ckeditor.com/4.10.0/basic-all/ckeditor.js'
			}, {
				property: 'config',
				value: {}
			}, {
				property: 'throttle',
				value: 200
			}, {
			}, {
				property: 'tagName',
				value: 'div'
			}, {
				property: 'readOnly',
				value: true
			} ].forEach( ( { property, value } ) => {
				setPropsForTestGroup( { [ property ]: value } );

				it( `"${ property }" should be configurable`, () => {
					expect( component[ property ] ).to.equal( value );
				} );
			} );
		} );

		[ {
			readOnly: true,
			config: { readOnly: false }
		}, {
			readOnly: false,
			config: { readOnly: true }
		} ].forEach( ( { readOnly, config } ) => {
			describe( `when component.readOnly = ${ readOnly } and config.readOnly = ${ config.readOnly }`, () => {
				setPropsForTestGroup( { readOnly, config } );

				it( 'should use component.readOnly', () => {
					expect( CKEditorNamespace.replace.lastCall.args[ 1 ] ).to.include( { readOnly } );
				} );
			} );
		} );

		describe( 'when editor type', () => {
			[ {
				type: 'unset',
				method: 'replace'
			}, {
				type: 'classic',
				method: 'replace'
			}, {
				type: 'inline',
				method: 'inline'
			} ].forEach( ( { type, method } ) => {
				describe( type === 'unset' ? 'unset' : `set to "${ type }"`, () => {
					const config = { foo: 'bar' };

					if ( type !== 'unset' ) {
						setPropsForTestGroup( { type } );
					} else {
						type = 'classic';
					}

					setPropsForTestGroup( { config } );

					it( `"component.type" should be "${ type }"`, () => {
						expect( component.type ).to.equal( type );
					} );

					it( `should call "CKEDITOR.${ method }" with given config`, () => {
						sinon.assert.calledOnce( CKEditorNamespace[ method ] );

						expect( CKEditorNamespace[ method ].lastCall.args[ 1 ] ).to.include( config );
					} );
				} );
			} );

			describe( 'set to invalid value', () => {
				it( 'should be disallowed by validator', () => {
					expect( component.$options.props.type.validator( 'foo' ) ).to.be.false;
				} );
			} );
		} );
	} );

	describe( 'events', () => {
		[ 'focus', 'blur' ].forEach( evtName => {
			it( `should emit "${ evtName }"`, () => {
				const spy = sandbox.spy();
				component.$on( evtName, spy );
				component.instance.fire( evtName );
				sinon.assert.calledOnce( spy );
			} );
		} );

		it( 'should emit "input"', () => {
			const spy = sandbox.spy();
			const stub = sandbox.stub( component.instance, 'getData' ).returns( '<p>foo</p>' );
			const clock = sinon.useFakeTimers();

			component.$on( 'input', spy );

			// Change event is throttled for 80ms.
			component.instance.fire( 'change' );
			clock.tick( 20 );

			component.instance.fire( 'change' );
			clock.tick( 40 );

			component.instance.fire( 'change' );
			clock.tick( 80 );

			sinon.assert.calledOnce( spy );

			// Let's verify what happens when change event occur
			// without real value change.
			stub.returns( component.value );
			component.instance.fire( 'change' );
			clock.tick( 80 );

			sinon.assert.calledOnce( spy );

			clock.restore();
		} );

		describe( 'with custom throttle value', () => {
			setPropsForTestGroup( { throttle: 200 } );

			it( 'should throttle "input" for the given timeout', () => {
				const spy = sandbox.spy();
				const clock = sinon.useFakeTimers();

				sandbox.stub( component.instance, 'getData' ).returns( '<p>bar</p>' );

				component.$on( 'input', spy );

				component.instance.fire( 'change' );
				component.instance.fire( 'change' );
				component.instance.fire( 'change' );

				clock.tick( 50 );

				component.instance.fire( 'change' );
				component.instance.fire( 'change' );
				component.instance.fire( 'change' );

				clock.tick( 100 );

				component.instance.fire( 'change' );
				component.instance.fire( 'change' );
				component.instance.fire( 'change' );

				clock.tick( 200 );

				sinon.assert.calledOnce( spy );
				clock.restore();
			} );
		} );
	} );

	describe( 'when component destroyed', () => {
		beforeEach( () => {
			sandbox.spy( component.instance, 'destroy' );
			wrapper.destroy();
		} );

		it( 'should call "instance.destroy"', () => {
			sinon.assert.calledOnce( component.instance.destroy );
		} );
	} );

	describe( 'when watched property changed before editor initialized', () => {
		beforeEach( () => {
			skipReady = true;
			component.instance = null;
		} );

		describe( 'property', () => {
			[
				{
					property: 'value',
					value: 'foobar'
				},
				{
					property: 'readOnly',
					value: true
				}
			].forEach( ( { property, value } ) => {
				it( `"${ property }" should avoid instance operations`, () => {
					wrapper.setProps( {
						[ property ]: value
					} );

					return Vue.nextTick().then( () => {
						sinon.assert.pass();
					} );
				} );
			} );
		} );
	} );

	// This test might look a bit strange, but it's crucial to run things in proper order.
	describe( 'when component destroyed before getEditorNamespace resolves', () => {
		let resolveMockReturnedPromise,
			resolveMockCalled;

		const whenMockCalled = new Promise( res => {
			resolveMockCalled = res;
		} );

		const mockReturnedPromise = new Promise( res => {
			resolveMockReturnedPromise = res;
		} );

		const originalMethod = getEditorNamespace.scriptLoader;

		// Mock `getEditorNamespace` before component is created.
		before( () => {
			skipReady = true;

			getEditorNamespace.scriptLoader = () => {
				resolveMockCalled();
				return mockReturnedPromise;
			};

			return deleteCkeditorScripts();
		} );

		// When component is created.
		beforeEach( done => {
			// Wait for the mock to be called so that we are sure that `component.mounted` is called and it awaits for the promise.
			whenMockCalled.then( () => {
				wrapper.destroy();

				// Wait for `component.beforeDestroy`.
				Vue.nextTick().then( () => {
					window.CKEDITOR = CKEditorNamespace;

					resolveMockReturnedPromise( CKEditorNamespace );

					// Wait for components callback to `getEditorNamespace`.
					Vue.nextTick().then( done );
				} );
			} );
		} );

		after( () => {
			getEditorNamespace.scriptLoader = originalMethod;
		} );

		it( 'editor shouldn\'t be initialized', () => {
			sinon.assert.notCalled( CKEditorNamespace.replace );
		} );
	} );

	[ {
		property: 'value',
		value: 'foo',
		spyOn: [ 'setData', true ],
		ignore: !!CKEditorNamespace.env.ie // (#4)
	}, {
		property: 'value',
		value: '',
		spyOn: [ 'setData', false ],
		ignore: !!CKEditorNamespace.env.ie // (#4)
	}, {
		property: 'readOnly',
		value: true,
		spyOn: [ 'setReadOnly', true ]
	}, {
		property: 'readOnly',
		value: false,
		spyOn: [ 'setReadOnly', true ]
	}, {
		property: 'readOnly',
		value: null,
		spyOn: [ 'setReadOnly', false ]
	} ].forEach( ( { property, value, spyOn: [ method, spyCalled ], ignore = false } ) => {
		if ( ignore ) {
			return;
		}

		describe( `when "component.${ property }" changes to "${ value }"`, () => {
			let spy;

			beforeEach( () => {
				spy = sandbox.spy( component.instance, method );
				wrapper.setProps( { [ property ]: value } );
				return Vue.nextTick();
			} );

			it( `${ spyCalled ? 'should' : 'shouldn\'t' } call "instance.${ method }"`, () => {
				if ( spyCalled ) {
					sinon.assert.calledWith( spy, value );
				} else {
					sinon.assert.notCalled( spy );
				}
			} );
		} );
	} );

	function setPropsForTestGroup( newProps ) {
		// "before" is executed before "beforeEach", so we can setup props now.
		before( () => {
			props = { ...props, ...newProps };
		} );

		after( () => {
			props = null;
		} );
	}
} );

describe( 'component on detached element', () => {
	let wrapper;

	afterEach( () => {
		wrapper.destroy();
	} );

	after( () => {
		return deleteCkeditorScripts();
	} );

	it( 'tries to mount component on detached element and use default interval strategy before creates', () => {
		const parent = document.createElement( 'div' );
		// Vue will replace mount target, so we have extra parent to manipulate it.
		const mountTarget = document.createElement( 'div' );
		parent.appendChild( mountTarget );

		wrapper = createComponent( {}, mountTarget );

		return delay( 100, () => {
			// Editor is created after namespace loads
			// so we need to wait for the real results
			expect( wrapper.vm.instance ).to.be.undefined;
		} ).then( () => {
			document.body.appendChild( parent );
		} ).then( () => {
			return delay( 1000, () => {
				expect( wrapper.vm.instance ).to.be.not.null;
			} );
		} );
	} );

	it( 'tries to mount component on detached element and use callback strategy', () => {
		const parent = document.createElement( 'div' );
		// Vue will replace mount target, so we have extra parent to manipulate it.
		const mountTarget = document.createElement( 'div' );
		parent.appendChild( mountTarget );
		let createEditor;

		wrapper = createComponent(
			{
				config: {
					delayIfDetached_callback: finishCreation => {
						createEditor = finishCreation;
					}
				}
			},
			mountTarget
		);

		return delay( 100, () => {
			// Editor is created after namespace loads
			// so we need to wait for the real results
			expect( wrapper.vm.instance ).to.be.undefined;
		} ).then( () => {
			document.body.appendChild( parent );
			createEditor();
		} ).then( () => {
			return delay( 1000, () => {
				expect( wrapper.vm.instance ).to.be.not.null;
			} );
		} );
	} );
} );

function createComponent( props, mountTarget = document.body ) {
	const fakeParent = document.createElement( 'span' );

	props = { ...props };

	if ( props.config ) {
		props.config.observableParent = fakeParent;
	} else {
		props.config = { observableParent: fakeParent };
	}

	return mount( CKEditorComponent, {
		propsData: props,
		attachTo: mountTarget
	} );
}
