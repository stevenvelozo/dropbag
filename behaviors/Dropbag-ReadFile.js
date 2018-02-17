// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libFS = require('fs');
var libAsync = require('async');
var libMime = require('mime');

/**
* Dropbag File Read Function
*
* This is going to be abstracted to read files to mongo gridfs next.
* 

 This takes a parameters object which looks like this:

	{
		Stream: false,
		File: 'index.html',
		Path: '/home/harry/some/folder'
	}

 Note if stream is set to true, the function returns a stream object you can then pipe bytes from.
*/

module.exports = (pParameters, fCallback) =>
{
	if (typeof(pParameters) !== 'object')
	{
		fCallback(new Error('Parameters object not properly passed to file read.'));
		return false;
	}
	
	if ((typeof(pParameters.Path) !== 'string') || (typeof(pParameters.File) !== 'string'))
	{
		fCallback(new Error('Parameters object needs a file name and path to run the file read operation.'));
		return false;
	}

	var tmpStream = pParameters.hasOwnProperty('Stream') ? pParameters.Stream : false;

	if (tmpStream)
	{
		var tmpFileFullPath = pParameters.Path + '/' + pParameters.File;
		libAsync.waterfall(
			[
				function (fStageComplete)
				{
					libFS.stat(tmpFileFullPath, (pError, pFileStats) =>
					{
						if (pError)
							return fStageComplete(pError, {});
						else
							return fStageComplete(null, pFileStats);
					});
				},
			],
			function(pError, pFileStats)
			{
				if (pError)
					return fCallback(pError);

				var tmpFileInfo = {};
				// Abstract here when mongo, etc. is broken out.
				tmpFileInfo.Type = 'local';
				tmpFileInfo.filename = tmpFileFullPath;
				tmpFileInfo.length = pFileStats.size;
				tmpFileInfo.contentType = libMime.lookup(tmpFileFullPath);
				tmpFileInfo.stats = pFileStats;
				tmpFileInfo.getStream = (pStart, pEnd) =>
				{
					var tmpRange = {};
					if (pStart)
						tmpRange = {start: pStart, end: pEnd};
					
					return libFS.createReadStream(tmpFileInfo.filename, tmpRange);
				};

				return fCallback(null, tmpFileInfo);
			}
		);

		return false;
	}
	else
	{
		// Write Data to the file.
		libFS.readFile(pParameters.Path+'/'+pParameters.File,
			{
				encoding: 'utf8',
				flag: 'r'
			},
			(pError, pData)=>
			{
				if (pError)
				{
					fCallback(pError);
					return false;
				}

				fCallback(null, pData);
				return true;
			}
		);
	}
};
