
// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

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
var readFile = require('../behaviors/Dropbag-ReadFile.js');

var download = (pRequest, pResponse, fNext) =>
{
	// The split removes query string parameters so they are ignored by our static web server.
	// The substring cuts that out from the file path so relative files serve from the folders and server
	var tmpURL = pRequest.url.split("?")[0].substr(tmpRouteStrip.length);
	var tmpFileParts = tmpURL.split('/');
	var tmpFile = tmpFileParts[tmpFileParts.length - 1];

	var tmpNext = (typeof(fNext) === 'function') ? fNext : ()=>{};

	readFile(
		{
			Path:pRequest.DropbagParameters.Folder+tmpURL.substr(0, tmpURL.length - tmpFile.length),
			File: tmpFile,
			Stream:true
		},
		(pFileInfo)=>
		{
			if(pRequest.headers['range'])
			{
				// Range request, partially stream the file
				var tmpParts = pRequest.headers['range'].replace(/bytes=/, "").split("-");
				var tmpPartStart = tmpParts[0];
				var tmpPartEnd = tmpParts[1];

				var tmpStart = parseInt(tmpPartStart, 10);
				var tmpEnd = tmpPartEnd ? parseInt(tmpPartEnd, 10) : pFileInfo.length -1;
				var tmpChunkSize = (tmpEnd-tmpStart)+1;

				//console.log(`Range ${tmpStart}-${tmpEnd}`, {}, pRequest);

				pResponse.writeHead(206,
				{
					'Content-Range': 'bytes ' + tmpStart + '-' + tmpEnd + '/' + pFileInfo.length,
					'Accept-Ranges': 'bytes',
					'Content-Length': tmpChunkSize,
					'Content-Type': pFileInfo.contentType
				});

				var tmpStream = pFileInfo.getStream(tmpStart, tmpEnd);
				tmpStream.pipe(pResponse);
				tmpStream.once
				(
					'end',
					tmpNext
				);
			}
			else
			{
				pResponse.header("Content-Type", pFileInfo.contentType);
				pResponse.header("Content-Length", pFileInfo.length);

				if (pRequest.query.Attachment)
				{
					var tmpAttachmentName = (pRequest.query.Attachment !== 'true') ? pRequest.query.Attachment : pFileInfo.filename;
					tmpAttachmentName += '.' + libMediaProc.lookupExt(pFileInfo.contentType);
					pResponse.header('Content-Disposition', 'attachment; filename="' +tmpAttachmentName + '"');
				}

				var tmpStream = pFileInfo.getStream();

				tmpStream.pipe(pResponse);
				tmpStream.on('error', (pError)=>
				{
					return tmpNext(pError);
				});
				tmpStream.once
				(
					'end',
					tmpNext
				);
			}
		}
	);
};

module.exports = download;
*/