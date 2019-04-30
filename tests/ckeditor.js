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
	let sandbox, wrapper, component, CKEditorNamespace;

	before( () => {
		CKEditorNamespace = CKEDITOR;

		window.CKEDITOR = mockEditor;

		spies.replace = sinon.spy( CKEDITOR, 'replace' );
		spies.replace = sinon.spy( CKEDITOR, 'inline' );

		( { wrapper } = createComponent() );

		component = wrapper.vm;

		sandbox = sinon.createSandbox();
	} );

	after( () => {
		window.CKEDITOR = CKEditorNamespace;
		wrapper.destroy();
		sandbox.restore();
	} );

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

	describe( 'when editor type', () => {
		it( 'unset should call "CKEDITOR.replace"', () => {
			sinon.assert.calledOnce( spies.replace );
		} );

		describe( 'set to inline', () => {
			before( () => {

			} );
		} );
	} );

	function createComponent( props ) {
		const wrapper = mount( CKEditorComponent, {
			propsData: Object.assign( {}, props )
		} );

		return { wrapper, vm: wrapper.vm };
	}
} );
