import request from 'request';
import meta from '../meta';
import promisify from '../promisify';


let versionCache = '';
let versionCacheLastModified = '';

const isPrerelease = /^v?\d+\.\d+\.\d+-.+$/;



function getLatestVersion(callback: (error: Error | null, version?: string) => void) {
    const headers = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': encodeURIComponent(`NodeBB Admin Control Panel/${(meta.config as { title: string }).title}`),
    };

    if (versionCacheLastModified) {
        headers['If-Modified-Since'] = versionCacheLastModified;
    }
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    request('https://api.github.com/repos/NodeBB/NodeBB/releases/latest', {
        json: true,
        headers: headers,
        timeout: 2000,
    }, (err: Error, res: request.Response, latestRelease) => {
        if (err) {
            return callback(err);
        }

        if ((res as { statusCode : number}).statusCode === 304) {
            return callback(null, versionCache);
        }

        if ((res as { statusCode : number}).statusCode !== 200) {
            return callback(new Error((res as { statusMessage : string }).statusMessage));
        }

        if (!latestRelease || !((latestRelease as { tag_name : string }).tag_name)) {
            return callback(new Error('[[error:cant-get-latest-release]]'));
        }
        const tagName = (latestRelease as { tag_name : string}).tag_name.replace(/^v/, '');
        versionCache = tagName;
        const s = 'last-modified';
        versionCacheLastModified = (res as { headers : { 'last-modified' : string }}).headers[s];
        callback(null, versionCache);
    });
}

export { getLatestVersion };
export { isPrerelease };
promisify(exports);
