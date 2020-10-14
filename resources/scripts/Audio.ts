import { ResourceData } from "./Resource";

export interface IAudio {

}

export class AudioManager extends ResourceData<IAudio> {

    public static readonly instance: AudioManager = new AudioManager();

    protected readonly resDataFile: string = "audio";

    private constructor() {
        super();
    }

    protected getResPaths(entry: IAudio): Array<string> {
        return [];
    }

    public play(clip: cc.AudioClip): void {
        try {
            cc.audioEngine.play(clip, true, 0);
        } catch (e) {
            console.error(`AudioManager.play: ${e}`);
        }
    }

}
