import { IResPreloadEntry, ResourceData } from "./Resource";

export interface IAudio {
    readonly res: string;
}

export class AudioManager extends ResourceData<IAudio> {

    public static readonly instance: AudioManager = new AudioManager();

    protected readonly resDataFile: string = "audio";

    private constructor() {
        super();
    }

    protected getResPreloadEntries(entry: IAudio): Array<IResPreloadEntry> {
        return [{
            res: entry.res,
            type: cc.AudioClip,
        }];
    }

}
