export class Audio {

    public static readonly instance: Audio = new Audio();

    private constructor() {}

    public play(clip: cc.AudioClip): void {
        try {
            cc.audioEngine.play(clip, true, 0);
        } catch (e) {
            console.error(`Audio.play: ${e}`);
        }
    }

}
