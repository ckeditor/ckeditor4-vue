/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Vue from 'vue';
import { mount } from '@vue/test-utils';
import CKEditorComponent from '../src/ckeditor';

describe( 'CKEditor Component', () => {
	let sandbox, wrapper;

	beforeEach( () => {
		( { wrapper } = createComponent() );

		sandbox = sinon.createSandbox();
	} );

	afterEach( () => {
		sandbox.restore();
		wrapper.destroy();
	} );

	it( 'component should have a name', () => {
		expect( CKEditorComponent.name ).to.equal( 'ckeditor' );
	} );

	function createComponent( props ) {
		const wrapper = mount( CKEditorComponent, {
			propsData: Object.assign( {}, props )
		} );

		return { wrapper, vm: wrapper.vm };
	}
} );
