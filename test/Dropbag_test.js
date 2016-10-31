/**
* Unit tests for Dropbag
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require('chai');
var Expect = Chai.expect;

var libFS = require('fs');

var libFable = require('fable');
var libDropbag = require('../Dropbag.js').new(libFable);

var TEST_STAGING = __dirname+'/stage';

// Cleanup the staging folder
libFS.rmdir(TEST_STAGING,
	(pError)=>
	{
		if (pError)
			console.log('Problem deleting staging files (ENOENT just means it is not there and is expected) '+pError);
	}
);

suite
(
	'Dropbag',
	() =>
	{
		setup (() => {});

		suite
		(
			'Object Sanity and File System-based Storage',
			() =>
			{
				test
				(
					'initialize should build a happy little object',
					() =>
					{
						Expect(libDropbag).to.be.an('object', 'Dropbag should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'create folder recursively',
					(fTestDone) =>
					{
						libDropbag.makeFolderRecursive({Path:TEST_STAGING},
							(pError) =>
							{
								libFS.stat(TEST_STAGING, 
									(pError, pFileStats) =>
									{
										Expect(pError).to.equal(null, 'Dropbag should create folders recursively.');
							
										// File exists
										return fTestDone();
									});
							});
					}
				);
				test
				(
					'store a file',
					(fTestDone) =>
					{
						libDropbag.storeFile({Path:TEST_STAGING, File:'Test.txt', Data:'This was a test'},
							(pError) =>
							{
								libFS.stat(TEST_STAGING+'/Test.txt', 
									(pError, pFileStats) =>
									{
										Expect(pError).to.equal(null, 'Dropbag should create files correctly.');
							
										// File exists
										return fTestDone();
									});
							});
					}
				);
				test
				(
					'read a file',
					(fTestDone) =>
					{
						libDropbag.readFile({Path:TEST_STAGING, File:'Test.txt'},
							(pError, pData) =>
							{
								Expect(pData).to.contain('was a test');
								fTestDone();
							});
					}
				);
				test
				(
					'get file info',
					(fTestDone) =>
					{
						libDropbag.fileInfo({Path:TEST_STAGING, File:'Test.txt'},
							(pError, pStats) =>
							{
								Expect(pStats.size).to.equal(15);
								fTestDone();
							});
					}
				);
				test
				(
					'fail to get file info',
					(fTestDone) =>
					{
						libDropbag.fileInfo({Path:TEST_STAGING, File:'TestDoesNotExistYo.txt'},
							(pError, pStats) =>
							{
								Expect(pError).to.not.equal(undefined);
								fTestDone();
							});
					}
				);
				test
				(
					'get file exists',
					(fTestDone) =>
					{
						libDropbag.fileExists({Path:TEST_STAGING, File:'Test.txt'},
							(pError, pExists) =>
							{
								Expect(pExists).to.equal(true);
								fTestDone();
							});
					}
				);
				test
				(
					'fail to get file exists',
					(fTestDone) =>
					{
						libDropbag.fileExists({Path:TEST_STAGING, File:'TestDoesNotExistYo.txt'},
							(pError, pExists) =>
							{
								Expect(pExists).to.not.equal('Bobsyouruncle');
								fTestDone();
							});
					}
				);
				test
				(
					'get file listing',
					(fTestDone) =>
					{
						libDropbag.fileList({Path:TEST_STAGING},
							(pError, pPath, pList) =>
							{
								Expect(pList[0]).to.contain('Test.txt');
								fTestDone();
							});
					}
				);
				test
				(
					'fail to get file exists',
					(fTestDone) =>
					{
						libDropbag.fileList({Path:TEST_STAGING+'DoesNotExistYo'},
							(pError, pList) =>
							{
								Expect(pError.code).to.equal('ENOENT');
								fTestDone();
							});
					}
				);
				test
				(
					'delete a file',
					(fTestDone) =>
					{
						libDropbag.deleteFile({Path:TEST_STAGING, File:'Test.txt'},
							(pError) =>
							{
								Expect(pError).to.equal(undefined);
								fTestDone();
							});
					}
				);
			}
		);
	}
);