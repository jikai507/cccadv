import { DB } from "../DB";

const {ccclass, property, menu} = cc._decorator;

export enum Language {
    Chinese,
    English,
}

@ccclass
@menu("cccadv/ComSetting")
export class ComSetting extends cc.Component {

    public static readonly MIN_VOLUME: number = 0;

    public static readonly MAX_VOLUME: number = 100;

    private static readonly DB_KEY: string = "setting";

    @property({ visible: true, type: cc.Enum(Language) })
    private language: Language = Language.Chinese;

    @property({ visible: true })
    private isMute: boolean = false;

    @property({ visible: true, type: cc.Integer, min: ComSetting.MIN_VOLUME, max: ComSetting.MAX_VOLUME })
    private volumeOfBackgroundMusic: number = 75;

    @property({ visible: true, type: cc.Integer, min: ComSetting.MIN_VOLUME, max: ComSetting.MAX_VOLUME })
    private volumeOfSoundEffect: number = 75;

    @property({ visible: true, type: cc.Integer, min: ComSetting.MIN_VOLUME, max: ComSetting.MAX_VOLUME })
    private volumeOfVoice: number = 75;

    protected start(): void {
        this.load();
    }

    public setLanguage(lang: Language): void {
        if (undefined === lang || null === lang) {
            return;
        }
        this.language = lang;
    }

    public getLanguage(): Language {
        return this.language;
    }

    public set muteMode(isMute: boolean) {
        if (true === isMute || false === isMute) {
            this.isMute = isMute;
        }
    }

    public get muteMode(): boolean {
        return this.isMute;
    }

    private clampVolume(v: number): number {
        if (v < ComSetting.MIN_VOLUME) {
            return ComSetting.MIN_VOLUME;
        }
        if (v > ComSetting.MAX_VOLUME) {
            return ComSetting.MAX_VOLUME;
        }
        return v;
    }

    public setVolumeOfBackgroundMusic(v: number): void {
        if (undefined === v || null === v) {
            return;
        }
        this.volumeOfBackgroundMusic = this.clampVolume(v);
        this.save();
    }

    public getVolumeOfBackgroundMusic(): number {
        return this.volumeOfBackgroundMusic;
    }

    public setVolumeOfSoundEffect(v: number): void {
        if (undefined === v || null === v) {
            return;
        }
        this.volumeOfSoundEffect = this.clampVolume(v);
        this.save();
    }

    public getVolumeOfSoundEffect(): number {
        return this.volumeOfSoundEffect;
    }

    public setVolumeOfVoice(v: number): void {
        if (undefined === v || null === v) {
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
            DB.instance.put<ISetting>(ComSetting.DB_KEY, setting);
        } catch (e) {
            console.error(`ComSetting.save: ${e}`);
        }
    }

    private load(): void {
        try {
            const setting: ISetting = DB.instance.get<ISetting>(ComSetting.DB_KEY);
            if (undefined === setting || null === setting) {
                return;
            }
            this.muteMode = setting.isMute;
            this.setVolumeOfBackgroundMusic(setting.volumeOfBackgroundMusic);
            this.setVolumeOfSoundEffect(setting.volumeOfSoundEffect);
            this.setVolumeOfVoice(setting.volumeOfVoice);
        } catch (e) {
            console.error(`ComSetting.load: ${e}`);
        }
    }

}

interface ISetting {

    isMute: boolean;

    volumeOfBackgroundMusic: number;

    volumeOfSoundEffect: number;

    volumeOfVoice: number;

}
