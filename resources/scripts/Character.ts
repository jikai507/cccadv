import { IInitRequired, ILocaleText, ITable, IImage } from "./Interfaces";
import { ResourceManager } from "./ResourceManager";

export interface ICharacter {

    readonly characterName: ILocaleText;

    readonly image: IImage;

}

export class CharacterManager extends ResourceManager<ICharacter> {

    public static readonly instance: CharacterManager = new CharacterManager();

    protected resDataFile: string = "character";

    private constructor() {
        super();
    }

}
