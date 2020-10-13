import { IInitRequired, ITable } from "./Interfaces";
import { isNone } from "./Util";

export abstract class ResourceManager<T> implements IInitRequired {

    protected abstract readonly resDataFile: string;

    private resEntries: ITable<T> = {};

    public init(over: (err?: string) => void) {
        cc.resources.load(`data/${this.resDataFile}`, cc.JsonAsset, (err: Error, asset: cc.JsonAsset) => {
            if (err) {
                over(`${this["constructor"]}.init: load asset failed. ${err}`);
                return;
            }
            if (isNone(asset) || isNone(asset.json)) {
                over(`${this["constructor"]}.init: invalid data.`);
                return;
            }
            this.resEntries = asset.json;
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
            console.error(`${this["constructor"]}.get: ${e}`);
            return null;
        }
    }

}
