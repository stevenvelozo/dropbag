// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

const libAsync = require('async')
const libRimRaf = require('rimraf');

/**
* Dropbag Recursive Folder Delete Function
*
* This is going to be abstracted to store files to mongo gridfs next.
*

 This takes a parameters object which looks like this:

	{
		Path: '/home/harry/some/folder'
	}

 Which will delete that folder and everything after that.
*/

module.exports = (pParameters, fCallback) =>
{
	if (typeof(pParameters) !== 'object')
	{
		fCallback(new Error('Parameters object not properly passed to recursive folder delete.'));
		return false;
	}

	if (typeof(pParameters.Path) !== 'string')
	{
		fCallback(new Error('Parameters object needs a path to run the recursive folder delete operation.'));
		return false;
	}

	// Delete the folder tree.
	libRimRaf(pParameters.Path,
		(pError) =>
		{
			if (pError)
			{
				//TODO: why are we nuking the real error here?
				return fCallback(new Error('Error recursively deleting a folder '+pParameters.File));
			}

			fCallback(null);
		}
	);
	return false;
};
