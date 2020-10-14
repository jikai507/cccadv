import { IImage, ILocaleText } from "./Interfaces";
import { IResPreloadEntry, ResourceData } from "./Resource";

export interface IBackground {

    readonly placeName?: ILocaleText;

    readonly image: IImage;

}

export class BackgroundManager extends ResourceData<IBackground> {

    public static readonly instance: BackgroundManager = new BackgroundManager();

    protected readonly resDataFile: string = "background";

    private constructor() {
        super();
    }
    
    protected getResPreloadEntries(entry: IBackground): Array<IResPreloadEntry> {
        return [{
            res: entry.image.res,
            type: cc.SpriteFrame,
        }];
    }

}
