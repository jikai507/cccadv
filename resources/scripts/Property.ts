import { IResPreloadEntry, ResourceData } from "./Resource";

export interface IProperty {

    readonly name: string;

    readonly type: string;

}

export class PropertyManager extends ResourceData<IProperty> {

    public static readonly instance: PropertyManager = new PropertyManager();

    protected readonly resDataFile: string = "property";

    private constructor() {
        super();
    }

    protected getResPreloadEntries(entry: IProperty): Array<IResPreloadEntry> {
        return [];
    }

}
