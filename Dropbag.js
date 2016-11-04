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
var Dropbag = function()
{
	function createNew(pFable)
	{
		var _Fable = false;

		// If a valid Fable object isn't passed in, MAKE ONE
		if ((typeof(pFable) !== 'object') || (!pFable.hasOwnProperty('fable')))
		{
			_Fable = require('fable').new();
		}
		else
		{
			// What was passed in might be an Orator object, or a Fable object.  We want to work either way.  This does.
			_Fable = pFable.fable;
		}

		var makeFolderRecursive = require(`${__dirname}/behaviors/Dropbag-MakeFolderRecursive.js`);
		var deleteFolderRecursively = require(`${__dirname}/behaviors/Dropbag-DeleteFolderRecursive.js`);
		
		var storeFile = require(`${__dirname}/behaviors/Dropbag-StoreFile.js`);
		var readFile = require(`${__dirname}/behaviors/Dropbag-ReadFile.js`);
		var deleteFile = require(`${__dirname}/behaviors/Dropbag-DeleteFile.js`);

		var fileList = require(`${__dirname}/behaviors/Dropbag-ListFiles.js`);
		var fileExists = require(`${__dirname}/behaviors/Dropbag-Exists.js`);
		var fileInfo = require(`${__dirname}/behaviors/Dropbag-Info.js`);
		var checkHeritage = require(`${__dirname}/behaviors/Dropbag-CheckHeritage.js`);

		var getMimeType = require(`${__dirname}/behaviors/Dropbag-GetMimeType.js`);

		var _Parameters = false; 

		if (_Fable.settings.hasOwnProperty('Dropbag'))
			_Parameters = _Fable.settings.Dropbag;
		else
			_Parameters = require(__dirname+'/Dropbag-Defaults.json');

		var wireParameters = (pRequest, pResponse, fNext) =>
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
		var connectRoutes = function(pRestServer)
		{
			// Default to just serving from root
			var tmpRoute = (typeof(_Parameters.RoutePrefix) === 'undefined') ? /\/.*/ : new RegExp('/'+_Parameters.RoutePrefix+'\/.*');

			// Add the route
			pRestServer.get(tmpRoute, wireParameters, require(__dirname+'/endpoints/Dropbag-Download.js'));
			pRestServer.post(tmpRoute, wireParameters, require(__dirname+'/endpoints/Dropbag-Upload.js'));
		};


		var tmpNewDropbagObject = (
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

			new: createNew
		});

		return tmpNewDropbagObject;
	}

	return createNew();
};

module.exports = new Dropbag();
