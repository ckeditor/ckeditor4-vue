/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

const { join: joinPath } = require( 'path' );

const basePath = process.cwd();
const coverageDir = joinPath( basePath, 'coverage' );

module.exports = function( config ) {
	config.set( {
		basePath,

		frameworks: [ 'mocha', 'chai', 'sinon' ],

		files: [
			'https://cdn.ckeditor.com/4.25.1-lts/standard-all/ckeditor.js',
			'tests/**/*.js'
		],

		preprocessors: {
			'tests/**/*.js': [ 'webpack' ]
		},
		client: {
			mocha: {
				timeout: 3000
			},
			args: [
				process.env.CKEDITOR_LICENSE_KEY
			]
		},

		webpack: {
			mode: 'development',
			devtool: 'inline-source-map',

			module: {
				rules: [
					{
						test: /\.js$/,
						loader: 'babel-loader',
						exclude: /node_modules/,
						query: {
							compact: false,
							presets: [ '@babel/preset-env' ]
						}
					},
					{
						test: /\.js$/,
						loader: 'istanbul-instrumenter-loader',
						include: /src/,
						exclude: [
							/node_modules/
						],
						query: {
							esModules: true
						}
					}
				]
			}
		},

		webpackMiddleware: {
			noInfo: true,
			stats: 'minimal'
		},

		reporters: getReporters(),

		coverageReporter: {
			reporters: [
				// Prints a table after tests result.
				{
					type: 'text'
				},
				// Generates HTML tables with the results.
				{
					dir: coverageDir,
					type: 'html'
				},
				// Generates "lcov.info" file. It's used by external code coverage services.
				{
					type: 'lcovonly',
					dir: coverageDir
				}
			]
		},

		port: 9876,

		colors: true,

		logLevel: 'INFO',

		browsers: getBrowsers(),

		customLaunchers: {
			BrowserStack_Edge: {
				base: 'BrowserStack',
				os: 'Windows',
				os_version: '10',
				browser: 'edge'
			},
			BrowserStack_IE11: {
				base: 'BrowserStack',
				os: 'Windows',
				os_version: '10',
				browser: 'ie',
				browser_version: '11.0'
			},
			BrowserStack_Safari: {
				base: 'BrowserStack',
				os: 'OS X',
				os_version: 'High Sierra',
				browser: 'safari'
			}
		},

		browserStack: {
			username: process.env.BROWSER_STACK_USERNAME,
			accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
			build: getBuildName(),
			project: 'ckeditor4'
		},

		singleRun: true,

		concurrency: Infinity,

		browserNoActivityTimeout: 0,

		mochaReporter: {
			showDiff: true
		}
	} );
};

// Formats name of the build for BrowserStack. It merges a repository name and current timestamp.
// If env variable `CIRCLE_PROJECT_REPONAME` is not available, the function returns `undefined`.
//
// @returns {String|undefined}
function getBuildName() {
	const repoName = process.env.CIRCLE_PROJECT_REPONAME;

	if ( !repoName ) {
		return;
	}

	const repositoryName = repoName.replace( /-/g, '_' );
	const date = new Date().getTime();

	return `${ repositoryName } ${ date }`;
}

/**
 * Returns the value of Karma's browser option.
 *
 * @param {Array.<String>} browsers
 * @returns {Array.<String>|null}
 */
function getBrowsers() {
	if ( shouldEnableBrowserStack() ) {
		return [
			'Chrome',
			'Firefox',
			'BrowserStack_Safari',
			'BrowserStack_Edge',
			'BrowserStack_IE11'
		];
	}

	return [
		'Chrome'
		// 'Firefox'
	];
}

function getReporters() {
	if ( shouldEnableBrowserStack() ) {
		return [
			'mocha',
			'BrowserStack',
			'coverage'
		];
	}

	return [
		'mocha',
		'coverage'
	];
}

function shouldEnableBrowserStack() {
	if ( !process.env.BROWSER_STACK_USERNAME || !process.env.BROWSER_STACK_ACCESS_KEY ) {
		return false;
	}

	// If the CIRCLE_PR_REPONAME variable is set, it indicates that the PR comes from the forked repo.
	// For such builds, BrowserStack will be disabled. Read more: https://github.com/ckeditor/ckeditor5-dev/issues/358.
	return !( 'CIRCLE_PR_REPONAME' in process.env );
}
