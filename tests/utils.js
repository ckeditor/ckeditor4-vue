export function deleteCkeditorScripts() {
	// Give CKE4 some time for destroy actions
	return new Promise( res => {
		setTimeout( () => {
			const scripts = Array.from( document.querySelectorAll( 'script' ) );
			const ckeditorScripts = scripts.filter( scriptElement => {
				return scriptElement.src.indexOf( 'ckeditor.js' ) > -1;
			} );
			ckeditorScripts.forEach( x => x.parentNode.removeChild( x ) );

			delete window.CKEDITOR;
			console.log( '3 AFTER NAMESPACE deleted' );
			res();
		}, 1000 );
	} );
}
