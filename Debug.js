var libDropbag = require('./Dropbag.js');

var tmpFileStream = libDropbag.storeFile({Path:`${__dirname}/test/stage`, File:'WTF.txt', Stream:true},
	(pError, pFileInfo) =>
	{
	    console.log(JSON.stringify(pFileInfo));
	    var tmpWriteStream = pFileInfo.getWriteStream();
	    tmpWriteStream.write('First write!');
	    tmpWriteStream.write('Second write!');
	});
