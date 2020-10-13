import { isNone } from "./Util";

export class DB {

    public static readonly instance: DB = new DB();

    private constructor() {}

    public put<T>(key: string, object: T): void {
        try {
            if (!key || !object) {
                throw `invalid entry to put.`;
            }
            const json: string = JSON.stringify(object);
            if (isNone(json) || json.length < "{}".length) {
                throw `stringify object failed.`;
            }
            cc.sys.localStorage.setItem(key, json);
        } catch (e) {
            console.error(`DB.put: ${e}`);
        }
    }

    public get<T>(key: string): T {
        try {
            if (!key) {
                return null;
            }
            const json: string = cc.sys.localStorage.getItem(key);
            if (isNone(json)) {
                return null;
            }
            const object: T = JSON.parse(json);
            if (isNone(object)) {
                return null;
            }
            return object;
        } catch (e) {
            console.error(`DB.get: ${e}`);
            return null;
        }
    }

}
