import { ILocaleText, IImage } from "./Interfaces";
import { IResPreloadEntry, ResourceData } from "./Resource";

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

    protected getResPreloadEntries(entry: ICharacter): Array<IResPreloadEntry> {
        return [{
            res: entry.image.res,
            type: cc.SpriteFrame,
        }];
    }

}
