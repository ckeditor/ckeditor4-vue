/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const TerserWebpackPlugin = require( 'terser-webpack-plugin' );

module.exports = [
	createConfig( 'ckeditor.js' ),
	createConfig( 'legacy.js', [
		[ '@babel/preset-env',
			{
				useBuiltIns: 'usage',
				corejs: 3,
				targets: {
					'node': '10',
					'ie': '11'
				}
			}
		]
	], [ 'core-js/es/promise' ] )
];

function createConfig( filename, presets = [], polyfills = [] ) {
	return {
		mode: 'production',
		devtool: 'source-map',

		performance: {
			hints: false
		},

		entry: [ ...polyfills, path.join( __dirname, 'src', 'index.js' ) ],

		target: [ 'browserslist:last 2 versions' ],

		output: {
			filename,
			library: 'CKEditor',
			path: path.join( __dirname, 'dist' ),
			libraryTarget: 'umd',
			libraryExport: 'default'
		},

		optimization: {
			minimizer: [
				new TerserWebpackPlugin( {
					terserOptions: {
						output: {
							// Preserve license comments.
							comments: /^!/
						}
					}
				} )
			]
		},

		plugins: [
			new webpack.BannerPlugin( {
				banner: `/*!*
* @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
* For licensing, see LICENSE.md.
*/`,
				raw: true
			} )
		],

		module: {
			rules: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					options: {
						compact: false,
						presets
					}
				}
			]
		}
	};
}
