/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// To run tests use `npm run test`. This file is required for debugging with Webstorm.

'use strict';

/* eslint-env node */

const getKarmaConfig = require( './scripts/utils/getkarmaconfig' );

module.exports = config => config.set( getKarmaConfig() );
