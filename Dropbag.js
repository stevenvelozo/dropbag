// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Dropbag Reporting Service
*
* @class Dropbag
* @constructor
*/
const Dropbag = function()
{
	function createNew(pFable)
	{
		let _Fable = false;

		// If a valid Fable object isn't passed in, MAKE ONE
		if ((typeof(pFable) !== 'object') || !('fable' in pFable))
		{
			_Fable = require('fable').new();
		}
		else
		{
			// What was passed in might be an Orator object, or a Fable object.  We want to work either way.  This does.
			_Fable = pFable.fable;
		}

		const makeFolderRecursive = require(`${__dirname}/behaviors/Dropbag-MakeFolderRecursive.js`);
		const deleteFolderRecursively = require(`${__dirname}/behaviors/Dropbag-DeleteFolderRecursive.js`);

		const storeFile = require(`${__dirname}/behaviors/Dropbag-StoreFile.js`);
		const readFile = require(`${__dirname}/behaviors/Dropbag-ReadFile.js`);
		const deleteFile = require(`${__dirname}/behaviors/Dropbag-DeleteFile.js`);

		const fileList = require(`${__dirname}/behaviors/Dropbag-ListFiles.js`);
		const fileExists = require(`${__dirname}/behaviors/Dropbag-Exists.js`);
		const fileInfo = require(`${__dirname}/behaviors/Dropbag-Info.js`);
		const checkHeritage = require(`${__dirname}/behaviors/Dropbag-CheckHeritage.js`);

		const getMimeType = require(`${__dirname}/behaviors/Dropbag-GetMimeType.js`);

		let _Parameters = false;

		if (_Fable.settings.Dropbag)
		{
			_Parameters = _Fable.settings.Dropbag;
		}
		else
		{
			_Parameters = require(__dirname + '/Dropbag-Defaults.json');
		}

		const wireParameters = (pRequest, pResponse, fNext) =>
		{
			pRequest.DropbagParameters = _Parameters;
			fNext();
		};

		/**
		* Wire up routes for the API
		*
		* @method connectRoutes
		* @param {Object} pRestServer The Restify server object to add routes to
		*/
		const connectRoutes = (pRestServer) =>
		{
			// Default to just serving from root
			const tmpRoute = (typeof(_Parameters.RoutePrefix) === 'undefined') ? /\/.*/ : new RegExp('/' + _Parameters.RoutePrefix + '\/.*');

			// Add the route
			pRestServer.get(tmpRoute, wireParameters, require(__dirname + '/endpoints/Dropbag-Download.js'));
			pRestServer.post(tmpRoute, wireParameters, require(__dirname + '/endpoints/Dropbag-Upload.js'));
		};


		const tmpNewDropbagObject = (
		{
			connectRoutes: connectRoutes,

			makeFolderRecursive: makeFolderRecursive,
			deleteFolderRecursively: deleteFolderRecursively,

			storeFile: storeFile,
			readFile: readFile,
			deleteFile: deleteFile,

			fileList: fileList,
			fileExists: fileExists,
			fileInfo: fileInfo,
			checkHeritage: checkHeritage,

			getMimeType: getMimeType,

			new: createNew,
		});

		return tmpNewDropbagObject;
	}

	return createNew();
};

module.exports = new Dropbag();
