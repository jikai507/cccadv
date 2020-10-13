import { IInitRequired, ILocaleText, ITable, ITexture } from "./Interfaces";
import { isNone } from "./Util";

export interface ICharacter {

    readonly displayName: ILocaleText;

    readonly texture: ITexture;

}

export class CharacterManager implements IInitRequired {

    public static readonly instance: CharacterManager = new CharacterManager();

    private characters: ITable<ICharacter> = {};

    private constructor() {}

    public init(over: (err?: string) => void) {
        cc.resources.load("data/character", cc.JsonAsset, (err: Error, asset: cc.JsonAsset) => {
            if (err) {
                over(`CharacterManager.init: load json asset failed. ${err}`);
                return;
            }
            if (isNone(asset) || isNone(asset.json)) {
                over(`CharacterManager.init: invalid data.`);
                return;
            }
            this.characters = asset.json;
            over();
        });
    }

    public getCharacter(name: string): ICharacter {
        try {
            if (!name) {
                throw `invalid character name.`;
            }
            const character: ICharacter = this.characters[name];
            if (isNone(character)) {
                throw `not found character "${name}".`;
            }
            return character;
        } catch (e) {
            console.error(`CharacterManager.getCharacter: ${e}`);
            return null;
        }
    }

}
