import { ILocaleText, IImage } from "./Interfaces";
import { ResourceData } from "./Resource";

export interface ICharacter {

    readonly characterName: ILocaleText;

    readonly image: IImage;

}

export class CharacterManager extends ResourceData<ICharacter> {

    public static readonly instance: CharacterManager = new CharacterManager();

    protected readonly resDataFile: string = "character";

    private constructor() {
        super();
    }

    protected getResPaths(entry: ICharacter): Array<string> {
        return [entry.image.res];
    }

}
