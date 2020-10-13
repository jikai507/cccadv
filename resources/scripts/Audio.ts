import { ResourceManager } from "./ResourceManager";

export interface IAudio {

}

export class AudioManager extends ResourceManager<IAudio> {

    public static readonly instance: AudioManager = new AudioManager();

    protected resDataFile: string = "audio";

    private constructor() {
        super();
    }

    public play(clip: cc.AudioClip): void {
        try {
            cc.audioEngine.play(clip, true, 0);
        } catch (e) {
            console.error(`AudioManager.play: ${e}`);
        }
    }

}
