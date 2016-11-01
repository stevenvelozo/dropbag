// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libFS = require('fs');

/**
* Dropbag File Listing Function
*
* This is going to be abstracted to check listings of files in mongo gridfs next. 
* In gridfs (and other kvp systems) files will be tagged with the "Path".
* 

 This takes a parameters object which looks like this:

	{
		Path: '/home/harry/some/folder/to/create'
	}
*/


var fileList = (pParameters, fCallback) =>
{
	if (typeof(pParameters) !== 'object')
	{
		fCallback(new Error('Parameters object not properly passed to file listing.'));
		return false;
	}
	
	if (typeof(pParameters.Path) !== 'string')
	{
		fCallback(new Error('Parameters object needs a file name and path to run the file list operation.'));
		return false;
	}

	libFS.readdir(pParameters.Path,
		(pError, pFiles) =>
		{
			if (pError)
				return fCallback(pError, {});
			
			return fCallback(null, pParameters.Path, pFiles);
		});

	return false;
};

module.exports = fileList;
