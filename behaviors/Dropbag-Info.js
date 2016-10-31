// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libFS = require('fs');

/**
* Dropbag File Info Function
*
* This is going to be abstracted to check info on files in mongo gridfs next.
* 

 This takes a parameters object which looks like this:

	{
		File: 'index.html',
		Path: '/home/harry/some/folder/to/create'
	}
*/


var fileInfo = (pParameters, fCallback) =>
{
	if (typeof(pParameters) !== 'object')
	{
		fCallback(new Error('Parameters object not properly passed to file info.'));
		return false;
	}
	
	if ((typeof(pParameters.Path) !== 'string') || (typeof(pParameters.File) !== 'string'))
	{
		fCallback(new Error('Parameters object needs a file name and path to run the file info operation.'));
		return false;
	}

	libFS.stat(pParameters.Path + '/' + pParameters.File,
		(pError, pFileStats) =>
		{
			if (pError)
				return fCallback(pError, {});
			
			return fCallback(false, pFileStats);
		});

	return false;
};

module.exports = fileInfo;