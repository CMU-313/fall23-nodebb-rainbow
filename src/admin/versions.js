"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrerelease = exports.getLatestVersion = void 0;
const request_1 = __importDefault(require("request"));
const meta_1 = __importDefault(require("../meta"));
const promisify_1 = __importDefault(require("../promisify"));
let versionCache = '';
let versionCacheLastModified = '';
const isPrerelease = /^v?\d+\.\d+\.\d+-.+$/;
exports.isPrerelease = isPrerelease;
function getLatestVersion(callback) {
    const headers = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': encodeURIComponent(`NodeBB Admin Control Panel/${meta_1.default.config.title}`),
    };
    if (versionCacheLastModified) {
        headers['If-Modified-Since'] = versionCacheLastModified;
    }
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    (0, request_1.default)('https://api.github.com/repos/NodeBB/NodeBB/releases/latest', {
        json: true,
        headers: headers,
        timeout: 2000,
    }, (err, res, latestRelease) => {
        if (err) {
            return callback(err);
        }
        if (res.statusCode === 304) {
            return callback(null, versionCache);
        }
        if (res.statusCode !== 200) {
            return callback(new Error(res.statusMessage));
        }
        if (!latestRelease || !(latestRelease.tag_name)) {
            return callback(new Error('[[error:cant-get-latest-release]]'));
        }
        const tagName = latestRelease.tag_name.replace(/^v/, '');
        versionCache = tagName;
        const s = 'last-modified';
        versionCacheLastModified = res.headers[s];
        callback(null, versionCache);
    });
}
exports.getLatestVersion = getLatestVersion;
(0, promisify_1.default)(exports);
