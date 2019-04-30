/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Vue from 'vue';
import { mount } from '@vue/test-utils';
import CKEditorComponent from '../src/ckeditor';
import sinon from 'sinon';
import mockEditor from './_utils/mockeditor';

/* global window CKEDITOR */

describe( 'CKEditor Component', () => {
	const spies = {};

	let sandbox, wrapper, component, CKEditorNamespace, props;

	beforeEach( () => {
		CKEditorNamespace = CKEDITOR;

		window.CKEDITOR = mockEditor;

		spies.replace = sinon.spy( CKEDITOR, 'replace' );
		spies.inline = sinon.spy( CKEDITOR, 'inline' );

		( { wrapper } = createComponent( props ) );
		component = wrapper.vm;
		sandbox = sinon.createSandbox();
	} );

	afterEach( () => {
		window.CKEDITOR = CKEditorNamespace;

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

		[
			{
				name: 'value',
				default: ''
			}, {
				name: 'type',
				default: 'classic',
			}, {
				name: 'config',
				default: undefined
			}, {
				name: 'tagName',
				default: 'textarea'
			}, {
				name: 'readOnly',
				default: null
			}
		].forEach( prop => {
			it( `property "${ prop.name }" should have default value`, () => {
				expect( component[ prop.name ] ).to.equal( prop.default );
			} );
		} );
	} );

	describe( 'when editor type', () => {
		describe( 'unset', () => {
			it( 'unset should call "CKEDITOR.replace"', () => {
				sinon.assert.calledOnce( spies.replace );
			} );

			it( 'shouldn\'t call "CKEDITOR.inline"', () => {
				sinon.assert.notCalled( spies.inline );
			} );
		} );

		describe( 'explicitly set to "classic"', () => {
			setPropsForTestGroup( {
				type: 'classic'
			} );

			it( 'should call "CKEDITOR.replace"', () => {
				sinon.assert.calledOnce( spies.replace );
			} );

			it( 'shouldn\'t call "CKEDITOR.inline"', () => {
				sinon.assert.notCalled( spies.inline );
			} );
		} );

		describe( 'set to "inline"', () => {
			setPropsForTestGroup( {
				type: 'inline'
			} );

			it( 'should call "CKEDITOR.inline"', () => {
				sinon.assert.calledOnce( spies.inline );
			} );

			it( 'shouldn\'t call "CKEDITOR.replace"', () => {
				sinon.assert.notCalled( spies.replace );
			} );
		} );
	} );

	function createComponent( props ) {
		const wrapper = mount( CKEditorComponent, {
			propsData: { ...props }
		} );

		return { wrapper, vm: wrapper.vm };
	}

	function setPropsForTestGroup( newProps ) {
		// "before" is executed before "beforeEach", so we can setup props now.
		before( () => {
			props = { ...newProps };
		} );

		after( () => {
			props = null;
		} );
	}
} );
