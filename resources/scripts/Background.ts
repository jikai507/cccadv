import { IImage, ILocaleText } from "./Interfaces";
import { ResourceData } from "./Resource";

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

    protected getResPaths(entry: IBackground): Array<string> {
        return [entry.image.res];
    }

}
