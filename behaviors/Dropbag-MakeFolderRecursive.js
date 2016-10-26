// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libFS = require('fs');
var libPath = require('path');

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


var makeFolderRecursive = (pParameters, fCallback) =>
{
    if (typeof(pParameters) !== 'object')
    {
        fCallback(new Error('Parameters object not properly passed to recursive folder create.'));
        return false;
    }

    // If the mode isn't passed in, build it
    // TODO: Fable setting for default mode?
    if (typeof(pParameters.Mode) === 'undefined')
    {
        pParameters.Mode = parseInt('0777', 8) & ~process.umask();
    }

    // Check if we are just starting .. if so, build the initial state for our recursive function
    if (typeof(pParameters.CurrentPathIndex) === 'undefined')
    {
        // Build the tools to start recursing
        pParameters.ActualPath = libPath.normalize(pParameters.Path);
        pParameters.ActualPathParts = pParameters.ActualPath.split(libPath.sep);
        pParameters.CurrentPathIndex = 0;
        pParameters.CurrentPath = '';
    }
    else
    {
        // This is not our first run, so we will continue the recursion.
        // Build the new base path
        if (pParameters.CurrentPath == libPath.sep)
            pParameters.CurrentPath = pParameters.CurrentPath + pParameters.ActualPathParts[pParameters.CurrentPathIndex];
        else
            pParameters.CurrentPath = pParameters.CurrentPath + libPath.sep + pParameters.ActualPathParts[pParameters.CurrentPathIndex];
            
        // Increment the path index
        pParameters.CurrentPathIndex++;
    }
    

    // Check if the path is fully complete
    if (pParameters.CurrentPathIndex >= pParameters.ActualPathParts.length)
    {
        fCallback();
        return true;
    }

    // Check if the path exists
    libFS.open(pParameters.CurrentPath + libPath.sep + pParameters.ActualPathParts[pParameters.CurrentPathIndex], 'r',
        function(pError, pFileDescriptor)
        {
            if (pError && pError.code=='ENOENT')
            {
                /* Path doesn't exist, create it */
                //console.log('Created '+ pParameters.ActualPathParts[pParameters.CurrentPathIndex]+' ===> '+pParameters.CurrentPath + libPath.sep + pParameters.ActualPathParts[pParameters.CurrentPathIndex])
                libFS.mkdir(pParameters.CurrentPath + libPath.sep + pParameters.ActualPathParts[pParameters.CurrentPathIndex], pParameters.Mode,
                (pCreateError)=>
                {
                    if (!pCreateError)
                    {
                        // We have now created our folder and there was no error -- continue.
                        // Recurse!
                        return makeFolderRecursive(pParameters, fCallback);
                    }
                    else
                    {
                        fCallback();
                        return false;
                    }
                });  
            }
            else
            {
                // Recurse!
                return makeFolderRecursive(pParameters, fCallback);
            }
        }
    );
};

module.exports = makeFolderRecursive;