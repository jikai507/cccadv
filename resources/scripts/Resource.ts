import { IInitRequired, ITable } from "./Interfaces";
import { isNone, safecall } from "./Util";

export interface IResPreloadEntry {

    res: string;

    type: typeof cc.Asset;

}

export abstract class ResourceData<T> implements IInitRequired {

    protected abstract readonly resDataFile: string;

    private resEntries: ITable<T> = {};

    private get managerName(): string {
        return this["constructor"].name;
    }

    public init(over: (err?: Error) => void) {
        cc.resources.load(`data/${this.resDataFile}`, cc.JsonAsset, (err: Error, asset: cc.JsonAsset) => {
            if (err) {
                over(new Error(`${this.managerName}.init: load asset failed. ${err}`));
                return;
            }
            if (isNone(asset) || isNone(asset.json)) {
                over(new Error(`${this.managerName}.init: invalid data.`));
                return;
            }
            this.resEntries = asset.json;
            console.info(`${this.managerName}.init: finish.`);
            over();
        });
    }

    public get(name: string): T {
        try {
            if (!name) {
                throw `invalid res name.`;
            }
            const res: T = this.resEntries[name];
            if (isNone(res)) {
                throw `not found res "${name}".`;
            }
            return res;
        } catch (e) {
            console.error(`${this.managerName}.get: ${e}`);
            return null;
        }
    }

    protected abstract getResPreloadEntries(entry: T): Array<IResPreloadEntry>;

    public preload(over: (err?: Error) => void): number {
        const allPaths: Array<IResPreloadEntry> = [];

        for (let name in this.resEntries) {
            const entry: T = this.resEntries[name];
            const preloadEntries: Array<IResPreloadEntry> = this.getResPreloadEntries(entry);
            if (isNone(preloadEntries) || preloadEntries.length <= 0) {
                continue;
            }
            allPaths.push(...preloadEntries);
        }

        for (let i = 0; i < allPaths.length; i++) {
            const preloadEntry: IResPreloadEntry = allPaths[i];
            ResourceLoader.instance.load(preloadEntry.res, preloadEntry.type, (err: Error, asset: cc.Asset) => {
                if (!isNone(err)) {
                    over(new Error(`${this.managerName}.preload: load res "${preloadEntry.res}" error. ${err}`));
                    return;
                }
                if (!asset) {
                    over(new Error(`${this.managerName}.preload: invalid asset loaded. path is "${preloadEntry.res}".`));
                    return;
                }
                console.debug(`${this.managerName}.preload: load "${preloadEntry.res}" ok.`);
                over();
            });
        }

        return allPaths.length;
    }

}

interface IResourceCache {

    asset: cc.Asset;

    lastUseTime: number;

}

export class ResourceLoader {

    public static readonly instance: ResourceLoader = new ResourceLoader();

    private caches: ITable<IResourceCache> = {};

    private constructor() {

    }

    public load(path: string, type: typeof cc.Asset, onLoadEnd: (err: Error, asset: cc.Asset) => void) {
        const cache: IResourceCache = this.caches[path];
        if (!isNone(cache)) {
            safecall(onLoadEnd, null, cache.asset);
            return;
        }

        cc.resources.load(path, type, (_err: Error, _asset: cc.Asset) => {
            if (!isNone(_err)) {
                safecall(onLoadEnd, _err, null);
                return;
            }
            if (isNone(_asset)) {
                safecall(onLoadEnd, new Error(`ResourceLoader.load: invalid asset of path "${path}".`), null);
                return;
            }
            this.caches[path] = {
                asset: _asset,
                lastUseTime: Date.now(),
            };
            safecall(onLoadEnd, null, _asset);
        });
    }

}
