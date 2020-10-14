import { ResourceData } from "./Resource";

export interface IItem {
    readonly name: string;
}

export class ItemManager extends ResourceData<IItem> {

    public static readonly instance: ItemManager = new ItemManager();

    protected readonly resDataFile: string = "item";

    private constructor() {
        super();
    }

    protected getResPaths(entry: IItem): Array<string> {
        return [];
    }

}
