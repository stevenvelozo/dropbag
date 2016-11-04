// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libFS = require('fs');

/**
* Dropbag File Exists Function
*
* This is going to be abstracted to check files in mongo gridfs next.
* 

 This takes a parameters object which looks like this:

	{
		File: 'index.html',
		Path: '/home/harry/some/folder/to/create'
	}

 The callback is called with parameter 1 as the error code (or false) and parameter 2 as if the file exists or not.
*/

module.exports = (pParameters, fCallback) =>
{
	if (typeof(pParameters) !== 'object')
	{
		fCallback(new Error('Parameters object not properly passed to file exists.'));
		return false;
	}
	
	if ((typeof(pParameters.Path) !== 'string') || (typeof(pParameters.File) !== 'string'))
	{
		fCallback(new Error('Parameters object needs a file name and path to run the file exist operation.'));
		return false;
	}

	libFS.stat(pParameters.Path + '/' + pParameters.File, 
		(pError, pFileStats) =>
		{
			if (pError && pError.code=='ENOENT')
				// File does not exist
				return fCallback(false, false);
			else if (pError)
				// Some other error
				return fCallback(pError);

			// File exists
			return fCallback(false, true);
		});

	return false;
};
