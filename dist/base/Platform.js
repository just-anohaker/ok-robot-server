"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class NodePlatform {
    getUserDataDir() {
        const ownDirName = ".etm_okex_datas";
        const destDir = path.resolve(path.join(process.cwd(), ownDirName));
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir);
        }
        return destDir;
    }
}
class Platform {
    static getInstance() {
        if (Platform._instance === undefined) {
            Platform._instance = new Platform();
        }
        return Platform._instance;
    }
    constructor() {
        this._platformImpl = new NodePlatform();
    }
    setPlatform(platform) {
        this._platformImpl = platform;
    }
    getUserDataDir() {
        return this._platformImpl.getUserDataDir();
    }
}
exports.default = Platform;
