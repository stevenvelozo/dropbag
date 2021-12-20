/**
* Unit tests for Dropbag
*
* @license	 MIT
*
* @author	  Steven Velozo <steven@velozo.com>
*/

var Chai = require('chai');
var Expect = Chai.expect;

var libFS = require('fs');

var libFable = require('fable').new({});
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
					'read a file with streams',
					(fTestDone) =>
					{
						libDropbag.readFile({Path:__dirname, File:'Input.txt',Stream:true},
							(pError, pFileInfo) =>
							{
								Expect(pFileInfo.length).to.equal(52);
								// Now open the stream.
								var tmpStream = pFileInfo.getStream();
								tmpStream.on('data',
									(pChunk) =>
									{
										Expect(pChunk.toString()).to.equal('0123456789Byte 11 is where the fun starts.0123456789');
										//console.log(pChunk.toString());
									}
								);
								tmpStream.on('end',
									() =>
									{
										//console.log(`Read of ${pFileInfo.filename} complete.`);
										fTestDone();
									}
								);
							});
					}
				);
				test
				(
					'read part of a file with streams',
					(fTestDone) =>
					{
						libDropbag.readFile({Path:__dirname, File:'Input.txt',Stream:true},
							(pError, pFileInfo) =>
							{
								Expect(pFileInfo.length).to.equal(52);
								// Now open the stream.
								var tmpStream = pFileInfo.getStream(10, 41);
								tmpStream.on('data',
									(pChunk) =>
									{
										Expect(pChunk.toString()).to.equal('Byte 11 is where the fun starts.');
										//console.log(pChunk.toString());
									}
								);
								tmpStream.on('end',
									() =>
									{
										//console.log(`Read of ${pFileInfo.filename} complete.`);
										fTestDone();
									}
								);
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
					'store a file with streams',
					(fTestDone) =>
					{
						libDropbag.storeFile({Path:TEST_STAGING, File:'StreamWrite.txt', Stream:true},
							(pError, pFileInfo) =>
							{
								//console.log(JSON.stringify(pFileInfo));
								var tmpWriteStream = pFileInfo.getWriteStream();
								tmpWriteStream.write('First write!');
								//FIXME: below stream pattern is broken on NodeJS > v14 - the file does not exist after the first write
								// Now read it.
								libDropbag.readFile({Path:TEST_STAGING, File:'StreamWrite.txt'},
									(pError, pData) =>
									{
										Expect(pError).to.not.exist;
										Expect(pData).to.contain('First write!');
										tmpWriteStream.write('Second write!');
										// Now read it again!
										libDropbag.readFile({Path:TEST_STAGING, File:'StreamWrite.txt'},
											(pError, pData) =>
											{
												Expect(pData).to.contain('First write!');
												// Now close it.
												tmpWriteStream.close();
												fTestDone();
											});
									});
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
				test
				(
					'delete a file',
					(fTestDone) =>
					{
						libDropbag.deleteFile({Path:TEST_STAGING, File:'StreamWrite.txt'},
							(pError) =>
							{
								Expect(pError).to.equal(undefined);
								fTestDone();
							});
					}
				);
				test
				(
					'create a deep folder recursively',
					(fTestDone) =>
					{
						libDropbag.makeFolderRecursive({Path:TEST_STAGING+'/This/Folder/Is/Deep'},
							(pError) =>
							{
								libFS.stat(TEST_STAGING+'/This/Folder/Is/Deep',
									(pError, pFileStats) =>
									{
										Expect(pError).to.equal(null, 'Dropbag should create many folders recursively.');

										// Now store a deep file
										libDropbag.storeFile({Path:TEST_STAGING+'/This/Folder/Is', File:'DeepTest.txt', Data:'This was a really deep test'},
											(pError) =>
											{
												libFS.stat(TEST_STAGING+'/This/Folder/Is/DeepTest.txt',
													(pError, pFileStats) =>
													{
														Expect(pError).to.equal(null, 'Dropbag should create files correctly.');

														// File exists
														return fTestDone();
													});
											});
									});
							});
					}
				);
				test
				(
					'delete a folder recursively',
					(fTestDone) =>
					{
						libDropbag.deleteFolderRecursively({Path:TEST_STAGING+'/This'},
							(pError) =>
							{
								Expect(pError).to.equal(null, 'Dropbag should delete many folders recursively.');
								fTestDone();
							});
					}
				);
				test
				(
					'check the heritage of some paths',
					() =>
					{
						Expect(libDropbag.checkHeritage(
							{
								Path:'/This/Matches/That',
								Lineage:'/This/DoesNot/Matches/That'
							})).to.equal(false);
						Expect(libDropbag.checkHeritage(
							{
								Path:'/This/Matches/That',
								Lineage:'/This'
							})).to.equal(true);
						Expect(libDropbag.checkHeritage(
							{
								Path:'/This',
								Lineage:'/This/Thing'
							})).to.equal(false);
						Expect(libDropbag.checkHeritage(
							{
								Path:'/This/Matches/That',
								Lineage:'/Then/Something'
							})).to.equal(false);
					}
				);

			}
		);
	}
);
