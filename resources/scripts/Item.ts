import { ITable } from "./Interfaces";

export interface IItem {
    readonly name: string;
}

export class ItemManager {

    public static readonly instance: ItemManager = new ItemManager();

    private items: ITable<IItem> = {};

    private constructor() {}

}
