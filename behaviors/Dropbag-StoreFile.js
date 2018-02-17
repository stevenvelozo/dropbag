// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libFS = require('fs');
var libAsync = require('async')

var makeFolderRecursive = require(__dirname+'/Dropbag-MakeFolderRecursive.js');

/**
* Dropbag File Storage Function
*
* This is going to be abstracted to store files to mongo gridfs next.
* 

 This takes a parameters object which looks like this:

	{
		Data: '<html><head></head><body></body></html>',
		Stream: false,
		Append: false,
		Encoding: 'utf8',
		AutoCreateFolders: true,
		File: 'index.html',
		Path: '/home/harry/some/folder/to/create',
		Mode: 111101101
	}

 This article is a good place to start on filesystem modes:
 http://x-team.com/2015/02/file-system-permissions-umask-node-js/
 
 Note if stream is set to true, the function returns a stream object you can then pipe bytes into.
*/

module.exports = (pParameters, fCallback) =>
{
	if (typeof(pParameters) !== 'object')
	{
		fCallback(new Error('Parameters object not properly passed to file store.'));
		return false;
	}
	
	if ((typeof(pParameters.Path) !== 'string') || (typeof(pParameters.File) !== 'string'))
	{
		fCallback(new Error('Parameters object needs a file name and path to run the file store operation.'));
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
						if (pError && pError.code == 'ENOENT')
							return fStageComplete(null, {size:-1,exists:false});
						else if (pError)
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
				tmpFileInfo.stats = pFileStats;

				var tmpMode = (typeof(pParameters.Mode) === 'undefined') ? pParameters.Mode = parseInt('0744', 8) & ~process.umask() : pParameters.Mode;
				var tmpEncoding = (typeof(pParameters.Encoding) === 'undefined') ? 'utf8' : pParameters.Encoding;
				// Right now support basic append or write streams.
				var tmpFlags = (pParameters.Append) ? 'a' : 'w';
				tmpFileInfo.writeStreamOptions = (
				{
					'flags': tmpFlags,
					'encoding': tmpEncoding,
					'mode': tmpMode
				});

				tmpFileInfo.getWriteStream = () =>
				{
					return libFS.createWriteStream(tmpFileInfo.filename, tmpFileInfo.writeStreamOptions);
				};

				return fCallback(null, tmpFileInfo);
			}
		);

		return false;
	}
	else
	{
		/**** END OF WHAT IS TO BE ABSTRACTED OUT TO THE FILE STORAGE METHOD ****/
		libAsync.waterfall(
			[
				function (fStageComplete)
				{
					// TODO: STREAMS ARE INCOMPLETE
					// Create the folder automatically if it isn't there
					if (pParameters.hasOwnProperty('AutoCreateFolders') && pParameters.AutoCreateFolders)
						makeFolderRecursive({Path:pParameters.Path},fStageComplete);
					else
						fStageComplete(null);
					// STREAMS ARE INCOMPLETE
				}
			],
			function(pError)
			{
				if (pError)
				{
					fCallback(new Error('Error preparing to write data to the file '+pParameters.File));
					return false;
				}
			
				// If the mode isn't passed in, build it
				// TODO: Fable setting for default mode?
				var tmpMode = (typeof(pParameters.Mode) === 'undefined') ? pParameters.Mode = parseInt('0744', 8) & ~process.umask() : pParameters.Mode;

				// Write Data to the file.
				libFS.writeFile(pParameters.Path + '/' + pParameters.File, pParameters.Data,
					{
						encoding: 'utf8',
						mode: tmpMode,
						flag: 'w'
					},
					(pError)=>
					{
						if (pError)
						{
							fCallback(new Error('Error writing data to the file '+pParameters.File));
							return false;
						}

						fCallback(null);
						return true;
					}
				);
			}
		);
	}
};
