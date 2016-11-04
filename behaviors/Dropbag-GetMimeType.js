// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libMime = require('mime');

/**
* Dropbag File MimeType function
*
* Get Mime typs
*/

module.exports = (pFileName) =>
{
	return libMime.lookup(pFileName);
};
