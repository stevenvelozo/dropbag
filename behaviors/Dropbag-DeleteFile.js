// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libFS = require('fs');
var libAsync = require('async')

/**
* Dropbag File Delete Function
*
* This is going to be abstracted to store files to mongo gridfs next.
* 

 This takes a parameters object which looks like this:

	{
		File: 'index.html',
		Path: '/home/harry/some/folder'
	}
*/

module.exports = (pParameters, fCallback) =>
{
	if (typeof(pParameters) !== 'object')
	{
		fCallback(new Error('Parameters object not properly passed to file delete.'));
		return false;
	}
	
	if ((typeof(pParameters.Path) !== 'string') || (typeof(pParameters.File) !== 'string'))
	{
		fCallback(new Error('Parameters object needs a file name and path to run the file delete operation.'));
		return false;
	}


	// Delete the file.
	// TODO: Decide if we should stat on each one and branch for folders.  Discuss with Jason, based on tags vis-a-vis mongo gridfs.
	libFS.unlink(pParameters.Path + '/' + pParameters.File,
		(pError)=>
		{
			if (pError)
			{
				fCallback(new Error('Error deleting a file '+pParameters.File));
				return false;
			}

			fCallback();
			return true;
		}
	);
};
