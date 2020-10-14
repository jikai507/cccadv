import { DB } from "./DB";
import { isBoolean, isNone } from "./Util";

export enum Language {
    Chinese,
    English,
}

export class Setting {

    public static readonly MIN_VOLUME: number = 0;

    public static readonly MAX_VOLUME: number = 100;

    private static readonly DEFAULT_VOLUME: number = 75;

    private static readonly DB_KEY: string = "setting";

    public static readonly instance: Setting = new Setting();

    private language: Language = Language.Chinese;

    private isMute: boolean = false;

    private volumeOfBackgroundMusic: number = Setting.DEFAULT_VOLUME;

    private volumeOfSoundEffect: number = Setting.DEFAULT_VOLUME;

    private volumeOfVoice: number = Setting.DEFAULT_VOLUME;

    private constructor() {
        this.load();
    }

    public setLanguage(lang: Language): void {
        if (isNone(lang)) {
            return;
        }
        this.language = lang;
    }

    public getLanguage(): Language {
        return this.language;
    }

    public set muteMode(isMute: boolean) {
        if (isBoolean(isMute)) {
            this.isMute = isMute;
        }
    }

    public get muteMode(): boolean {
        return this.isMute;
    }

    private clampVolume(v: number): number {
        if (v < Setting.MIN_VOLUME) {
            return Setting.MIN_VOLUME;
        }
        if (v > Setting.MAX_VOLUME) {
            return Setting.MAX_VOLUME;
        }
        return v;
    }

    public setVolumeOfBackgroundMusic(v: number): void {
        if (isNone(v)) {
            return;
        }
        this.volumeOfBackgroundMusic = this.clampVolume(v);
        this.save();
    }

    public getVolumeOfBackgroundMusic(): number {
        return this.volumeOfBackgroundMusic;
    }

    public setVolumeOfSoundEffect(v: number): void {
        if (isNone(v)) {
            return;
        }
        this.volumeOfSoundEffect = this.clampVolume(v);
        this.save();
    }

    public getVolumeOfSoundEffect(): number {
        return this.volumeOfSoundEffect;
    }

    public setVolumeOfVoice(v: number): void {
        if (isNone(v)) {
            return;
        }
        this.volumeOfVoice = this.clampVolume(v);
        this.save();
    }

    public getVolumeOfVoice(): number {
        return this.volumeOfVoice;
    }

    private save(): void {
        try {
            const setting: ISetting = {
                isMute: this.muteMode,
                volumeOfBackgroundMusic: this.getVolumeOfBackgroundMusic(),
                volumeOfSoundEffect: this.getVolumeOfSoundEffect(),
                volumeOfVoice: this.getVolumeOfVoice(),
            };
            DB.instance.put<ISetting>(Setting.DB_KEY, setting);
        } catch (e) {
            console.error(`Setting.save: ${e}`);
        }
    }

    private load(): void {
        try {
            const setting: ISetting = DB.instance.get<ISetting>(Setting.DB_KEY);
            if (isNone(setting)) {
                return;
            }
            this.muteMode = setting.isMute;
            this.setVolumeOfBackgroundMusic(setting.volumeOfBackgroundMusic);
            this.setVolumeOfSoundEffect(setting.volumeOfSoundEffect);
            this.setVolumeOfVoice(setting.volumeOfVoice);
        } catch (e) {
            console.error(`Setting.load: ${e}`);
        }
    }

}

interface ISetting {

    isMute: boolean;

    volumeOfBackgroundMusic: number;

    volumeOfSoundEffect: number;

    volumeOfVoice: number;

}
