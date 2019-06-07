/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { mount } from '@vue/test-utils';
import CKEditorComponent from '../src/ckeditor';
import sinon from 'sinon';
import mockEditor from './_test-utils/mockeditor';

/* global window CKEDITOR */

const CKEditorNamespace = window.CKEDITOR;

describe( 'CKEditor Component', () => {
	const spies = {};

	let sandbox, wrapper, component, props;

	before( () => {
		window.CKEDITOR = mockEditor;
	} );

	beforeEach( done => {
		spies.replace = sinon.spy( CKEDITOR, 'replace' );
		spies.inline = sinon.spy( CKEDITOR, 'inline' );

		wrapper = createComponent( props );
		component = wrapper.vm;
		sandbox = sinon.createSandbox();

		component.$once( 'ready', () => {
			done();
		} );
	} );

	after( () => {
		window.CKEDITOR = CKEditorNamespace;
	} );

	afterEach( () => {
		for ( const key in spies ) {
			spies[ key ].restore();
		}

		wrapper.destroy();
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
					name: 'editorUrl',
					defaultValueRegex: /https:\/\/cdn\.ckeditor\.com\/4\.\d{1,2}\.\d{1,2}\/(standard|basic|full)(-all)?\/ckeditor\.js/
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
			].forEach( ( { name, defaultValue, defaultValueRegex } ) => {
				it( `"${ name }" should have default value`, () => {
					if ( defaultValue ) {
						expect( component[ name ] ).to.equal( defaultValue );
					}
					if ( defaultValueRegex ) {
						expect( component[ name ] ).to.match( defaultValueRegex );
					}
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
					name: 'editorUrl',
					value: 'https://cdn.ckeditor.com/4.10.0/basic-all/ckeditor.js'
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
			[ 'ready', 'instanceReady' ],
			[ 'input', 'change' ],
			[ 'focus' ],
			[ 'blur' ]
		].forEach( ( [ evtName, alias ] ) => {
			let getDataMock, spy, editorEvtName;

			beforeEach( () => {
				editorEvtName = alias || evtName;
				spy = sinon.spy();

				if ( evtName === 'input' ) {
					getDataMock = sinon.stub( component.instance, 'getData' ).returns( 'foo' );
				}

				component.$once( evtName, spy );
				component.instance.fire( editorEvtName );
			} );

			afterEach( () => {
				if ( getDataMock ) {
					getDataMock.restore();
					getDataMock = null;
				}
			} );

			it( `should emit "${ evtName }"`, () => {
				sinon.assert.calledOnce( spy );
			} );

			if ( evtName === 'input' ) {
				it( 'when data didn\'t change shouldn\'t emit input', () => {
					component.instance.fire( editorEvtName );

					sinon.assert.calledOnce( spy );
				} );
			}
		} );
	} );

	describe( 'when component destroyed', () => {
		beforeEach( () => {
			spies.destroy = sinon.spy( component.instance, 'destroy' );
			wrapper.destroy();
		} );

		it( 'should call "instance.destroy"', () => {
			sinon.assert.calledOnce( spies.destroy );
		} );

		it( 'should emit "destroy"', () => {
			expect( wrapper.emitted().destroy.length ).to.equal( 1 );
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
