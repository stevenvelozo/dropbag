// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
const libPath = require('path');

/**
* Dropbag File Exists Function
*
* This is going to be abstracted to check files in mongo gridfs next.
*

 This takes a parameters object which looks like this:

	{
		Lineage: '/home/harry/some/folder/heritage',
		Path: '/home/harry/some/folder/heritage/to/check'
	}
*/

module.exports = (pParameters, fCallback) =>
{
	if (typeof(pParameters) !== 'object')
	{
		fCallback(new Error('Parameters object not properly passed to file exists.'));
		return false;
	}

	if ((typeof(pParameters.Path) !== 'string') || (typeof(pParameters.Lineage) !== 'string'))
	{
		fCallback(new Error('Parameters object needs a lineage name and path to run the file heritage operation.'));
		return false;
	}

	const tmpParent = libPath.resolve(pParameters.Lineage);
	const tmpPath = libPath.resolve(pParameters.Path);

	// If the parent isn't as long as the path, the heritage doesn't match.
	if (tmpParent.length > tmpPath.length)
	{
		return false;
	}

	// If the parent base doesn't match the path, the heritage doesn't match.
	if (tmpPath.substring(0, tmpParent.length) != tmpParent)
	{
		return false;
	}

	return true;
};
