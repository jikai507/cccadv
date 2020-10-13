import { IImage, ILocaleText } from "./Interfaces";
import { ResourceManager } from "./ResourceManager";

export interface IBackground {

    readonly placeName?: ILocaleText;

    readonly image: IImage;

}

export class BackgroundManager extends ResourceManager<IBackground> {

    public static readonly instance: BackgroundManager = new BackgroundManager();

    protected resDataFile: string = "background";

    private constructor() {
        super();
    }

}
