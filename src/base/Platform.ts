import * as path from "path";
import * as fs from "fs";

export interface IPlatform {
    getUserDataDir(): string;
}

class NodePlatform implements IPlatform {
    getUserDataDir(): string {
        const ownDirName = ".etm_okex_datas";
        const destDir = path.resolve(path.join(process.cwd(), ownDirName));

        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir);
        }

        return destDir;
    }
}

class Platform implements IPlatform {
    private static _instance?: Platform;

    static getInstance(): Platform {
        if (Platform._instance === undefined) {
            Platform._instance = new Platform();
        }
        return Platform._instance!;
    }

    private _platformImpl: IPlatform;

    constructor() {
        this._platformImpl = new NodePlatform();
    }

    setPlatform(platform: IPlatform): void {
        this._platformImpl = platform;
    }

    getUserDataDir(): string {
        return this._platformImpl.getUserDataDir();
    }
}

export default Platform;