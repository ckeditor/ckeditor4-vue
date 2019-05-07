/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { mount } from '@vue/test-utils';
import CKEditorComponent from '../src/ckeditor';
import sinon from 'sinon';
import mockEditor from './_utils/mockeditor';

/* global window CKEDITOR */

describe( 'CKEditor Component', () => {
	const spies = {};

	let sandbox, wrapper, component, CKEditorNamespace, props;

	before( () => {
		CKEditorNamespace = CKEDITOR;
		window.CKEDITOR = mockEditor;
	} );

	beforeEach( () => {
		spies.replace = sinon.spy( CKEDITOR, 'replace' );
		spies.inline = sinon.spy( CKEDITOR, 'inline' );

		wrapper = createComponent( props );
		component = wrapper.vm;
		sandbox = sinon.createSandbox();
	} );

	after( () => {
		window.CKEDITOR = CKEditorNamespace;
	} );

	afterEach( () => {
		for ( const key in spies ) {
			spies[ key ].restore();
		}

		wrapper.destroy();

		// 'instance.destroy' is fired only after 'instanceReady',
		// but mocked editor wont fire it by itself, so manualy call destroy to clean listeners.
		component.instance.destroy();

		sandbox.restore();
	} );

	describe( 'initialization', () => {
		it( 'component should have a name', () => {
			expect( CKEditorComponent.name ).to.equal( 'ckeditor' );
		} );

		it( 'should render', () => {
			expect( wrapper.html() ).to.equal( '<div><textarea></textarea></div>' );
		} );

		describe( 'property', () => {
			[
				{
					name: 'value',
					defaultValue: ''
				}, {
					name: 'type',
					defaultValue: 'classic',
				}, {
					name: 'config',
					defaultValue: undefined
				}, {
					name: 'tagName',
					defaultValue: 'textarea'
				}, {
					name: 'readOnly',
					defaultValue: null
				}
			].forEach( ( { name, defaultValue } ) => {
				it( `"${ name }" should have default value`, () => {
					expect( component[ name ] ).to.equal( defaultValue );
				} );
			} );
		} );

		// Repeat description, so test are nicely grouped in the output,
		// but keep them separate in code, because they need different setup.
		describe( 'property', () => {
			[
				{
					name: 'value',
					value: 'foo'
				}, {
					name: 'type',
					value: 'inline'
				}, {
					name: 'config',
					value: {}
				}, {
					name: 'tagName',
					value: 'div'
				}, {
					name: 'readOnly',
					value: true
				}
			].forEach( ( { name, value } ) => {
				setPropsForTestGroup( { [ name ]: value } );

				it( `"${ name }" should be configurable`, () => {
					expect( component[ name ] ).to.equal( value );
				} );
			} );
		} );

		describe( 'when editor type', () => {
			[
				{
					type: 'unset',
					method: 'replace'
				}, {
					type: 'classic',
					method: 'replace'
				}, {
					type: 'inline',
					method: 'inline'
				}
			].forEach( ( { type, method } ) => {
				const otherMethod = method === 'inline' ? 'replace' : 'inline';

				describe( type === 'unset' ? 'unset' : `set to "${ type }"`, () => {
					if ( type !== 'unset' ) {
						setPropsForTestGroup( { type } );
					} else {
						type = 'classic';
					}

					it( `"component.type" should be "${ type }"`, () => {
						expect( component.type ).to.equal( type );
					} );

					it( `should call "CKEDITOR.${ method }"`, () => {
						sinon.assert.calledOnce( spies[ method ] );
					} );

					it( `shouldn't call "CKEDITOR.${ otherMethod }"`, () => {
						sinon.assert.notCalled( spies[ otherMethod ] );
					} );
				} );
			} );
		} );

		describe( 'when editor type', () => {
			describe( 'set to invalid value', () => {
				it( 'should be disallowed by validator', () => {
					expect( component.$options.props.type.validator( 'foo' ) ).to.be.false;
				} );
			} );
		} );
	} );

	describe( 'events', () => {
		[
			'ready',
			'input',
			'focus',
			'blur'
		].forEach( evtName => {
			beforeEach( () => {
				const evt = {};
				let editorEvtName;

				switch ( evtName ) {
					case 'ready':
						editorEvtName = 'instanceReady';
						break;
					case 'input':
						editorEvtName = 'change';
						break;
					default:
						editorEvtName = evtName;
				}

				component.instance.fire( editorEvtName, evt );
			} );

			it( `should emit "${ evtName }"`, () => {
				expect( 'foo' ).to.equal( 'foo' );
			} );
		} );
	} );

	describe( 'when component destroyed', () => {
		beforeEach( () => {
			spies.destroyEditor = sinon.spy( component, 'destroyEditor' );
			wrapper.destroy();
		} );

		it( 'should call "component.destroyEditor"', () => {
			sinon.assert.calledOnce( spies.destroyEditor );
		} );

		it( 'should emit "destroy"', () => {
			expect( wrapper.emitted().destroy.length ).to.equal( 1 );
		} );
	} );

	describe( 'when "component.destroyEditor" called', () => {
		beforeEach( () => {
			spies.destroy = sinon.spy( component, 'destroyEditor' );
			component.$_ready = Promise.resolve();
			component.destroyEditor();
		} );

		it( 'should call "instance.destroy"', () => {
			sinon.assert.calledOnce( spies.destroy );
		} );
	} );

	[
		{
			property: 'value',
			value: 'foo',
			spyOn: [ 'setData', true ]
		}, {
			property: 'value',
			value: '',
			spyOn: [ 'setData', false ]
		}, {
			property: 'readOnly',
			value: true,
			spyOn: [ 'setReadOnly', true ]
		}, {
			property: 'readOnly',
			value: false,
			spyOn: [ 'setReadOnly', true ]
		}
	].forEach( ( { property, value, spyOn: [ method, spyCalled ] } ) => {
		describe( `when "component.${ property }" changes`, () => {
			let spy;

			beforeEach( () => {
				spy = spies[ method ] = sinon.spy( component.instance, method );
				wrapper.setProps( { [ property ]: value } );
			} );

			it( `should call "instance.${ method }"`, () => {
				sinon.assert[ spyCalled ? 'calledOnce' : 'notCalled' ]( spy );
				spyCalled && sinon.assert.calledWith( spy, value );
			} );
		} );
	} );

	function createComponent( props ) {
		return mount( CKEditorComponent, {
			propsData: { ...props }
		} );
	}

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