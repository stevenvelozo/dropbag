
// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

var libFormidable = require('formidable');
var libAsync = require('async');

/**
* Dropbag Folder Recursive Create Function
*

 This takes a parameters object which looks like this:

    {
        Path: '/home/harry/some/folder/to/create',
        Mode: 111101101
    }

 This article is a good place to start on filesystem modes:
 http://x-team.com/2015/02/file-system-permissions-umask-node-js/

 This behavior is only really useful for file-based storage, but is a good utility to have with this kit.
*/
/*
var storeFile = require('../behaviors/Dropbag-StoreFile.js');

var upload = (pRequest, pResponse, fNext) =>
{
	var tmpNext = (typeof(fNext) === 'function') ? fNext : function() {};

	libAsync.waterfall([
		function(fStageComplete)
		{
			var tmpContentType = pRequest.header('Content-Type');

			if (tmpContentType.indexOf('multipart/form-data') >= 0)
			{
				var libParser = new libFormidable.IncomingForm();
				libParser.parse(pRequest, function(pError, pFields, pFiles)
				{
					if (pError)
						return fStageComplete(pError);

					var tmpUploadedFile = pFiles['file'];
					tmpContentType = tmpUploadedFile.type;

					var tmpFileStream = libFS.createReadStream(tmpUploadedFile.path);

					return fStageComplete(null, tmpFileStream);
				});
			}
			else
			{
				return fStageComplete(null, pRequest);
			}
		},
		function(pFileStream, fStageComplete)
		{
			// Check if the file is already there -- and overwrite if necessary.
			return storeArtifactFile(tmpFileName, tmpContentType, tmpIDObservationArtifact, pRequest, pFileStream, function(pError)
			{
				if (pError)
					fStageComplete(pError)
				else
				{
					pResponse.send({Success:true});
					return fStageComplete();
				}
			});
		}
	], tmpNext);
};

module.exports = upload;
*/