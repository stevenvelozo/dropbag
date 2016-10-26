/**
* Unit tests for Dropbag
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require('chai');
var Expect = Chai.expect;
var Assert = Chai.assert;

var libFable = require('fable');
var libDropbag = require('../Dropbag.js');

suite
(
	'Dropbag',
	() =>
	{
		setup (() => {});

		suite
		(
			'Object Sanity',
			() =>
			{
				test
				(
					'initialize should build a happy little object',
					() =>
					{
						var testDropbag = libDropbag.new(libFable);
						Expect(testDropbag).to.be.an('object', 'Dropbag should initialize as an object directly from the require statement.');
					}
				);
			}
		);
	}
);