import { ITable } from "./Interfaces";

export interface IProperty {

    readonly name: string;

    readonly type: string;

}

export class PropertyManager {

    public static readonly instance: PropertyManager = new PropertyManager();

    private properties: ITable<IProperty> = {};

    private constructor() {}

}
