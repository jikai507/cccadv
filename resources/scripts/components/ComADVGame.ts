import { AudioManager, IAudio } from "../Audio";
import { IBackground, BackgroundManager } from "../Background";
import { CharacterManager, ICharacter } from "../Character";
import { getTextByLanguage } from "../Language";
import { IContent, IPlayBGM, IPlotAction, ISetBackground, Plot, PlotManager } from "../Plot";
import { ResourceLoader } from "../Resource";
import { isNone, safecall } from "../Util";

const {ccclass, property, menu} = cc._decorator;

type ActionCallback = (err?: Error) => void;

@ccclass("PlotProgress")
class PlotProgress {

    @property({ visible: true })
    public plotID: string = PlotManager.BEGIN_PLOT_ID;

    @property({ visible: true, type: cc.Integer, min: 0 })
    public actionIndex: number = 0;

    @property({ visible: true })
    public autoSave: boolean = true;

}

@ccclass("CharacterPosition")
class CharacterPosition {

    @property({ visible: true })
    public pos: cc.Vec2 = cc.v2(0, 0);

    @property({ visible: true })
    public flip: boolean = false;

}

@ccclass
@menu("cccadv/ComADVGame")
export class ComADVGame extends cc.Component {

    @property({ visible: true, type: cc.Sprite })
    private background: cc.Sprite = null;

    @property({ visible: true, type: cc.RichText })
    private placeNameTag: cc.RichText = null;

    @property({ visible: true, type: cc.Sprite })
    private character: cc.Sprite = null;

    @property({ visible: true, type: cc.RichText })
    private characterNameTag: cc.RichText = null;

    @property({ visible: true, type: cc.RichText })
    private plotText: cc.RichText = null;

    @property({ visible: true, type: PlotProgress })
    private progress: PlotProgress = new PlotProgress();

    @property({ visible: true, type: [CharacterPosition] })
    private characterPosList: Array<CharacterPosition> = new Array<CharacterPosition>();

    protected onLoad(): void {
        try {
            cc.director.on("new_game", () => {
                this.onNewGame();
            });
        } catch (e) {
            console.error(`ComADVGame.onLoad: ${e}`);
        }
    }

    protected start(): void {}

    public onNewGame(): void {
        try {
            const plot: Plot = PlotManager.instance.get(PlotManager.BEGIN_PLOT_ID);
            this.progress.plotID = PlotManager.BEGIN_PLOT_ID;
            this.progress.actionIndex = 0;
            this.playPlot(plot);
        } catch (e) {
            console.error(`ComADVGame.onNewGame: ${e}`);
        }
    }

    private playPlot(plot: Plot): void {
        try {
            if (isNone(plot)) {
                throw `invalid plot to play.`;
            }

            const plotAction: IPlotAction = plot[this.progress.actionIndex];
            if (isNone(plotAction)) {
                throw `no action ${this.progress.actionIndex} in the plot.`;
            }

            switch (plotAction.type) {
            case "background":
                this.showBackground(plotAction as ISetBackground, this.onActionCallback.bind(this));
                break;
            case "bgm":
                this.playBGM(plotAction as IPlayBGM, this.onActionCallback.bind(this));
                break;
            case "soundeffect":
                break;
            case "content":
                this.showContent(plotAction as IContent, this.onActionCallback.bind(this));
                break;
            case "selection":
                break;
            }
        } catch (e) {
            console.error(`ComADVGame.playPlot: ${e}`);
        }
    }

    private showBackground(setBG: ISetBackground, callback: ActionCallback): void {
        if (!setBG) {
            safecall(callback, new Error(`ComADVGame.showBackground: invalid background to show.`));
            return;
        }
        const background: IBackground = BackgroundManager.instance.get(setBG.name);
        if (isNone(background)) {
            safecall(callback, new Error(`ComADVGame.showBackground: not found background "${setBG.name}".`));
            return;
        }
        if (this.placeNameTag) {
            this.placeNameTag.string = getTextByLanguage(background.placeName);
        }
        ResourceLoader.instance.load(background.image.res, cc.SpriteFrame, (err: Error, asset: cc.SpriteFrame) => {
            if (!isNone(err)) {
                safecall(callback, new Error(`ComADVGame.showBackground: ${err}`));
                return;
            }
            this.background.spriteFrame = asset;
            this.background.node.setPosition(cc.v2(
                background.image.pos.x,
                background.image.pos.y,
            ));
            this.background.node.setScale(cc.v2(
                background.image.scale.x,
                background.image.scale.y,
            ));
            safecall(callback, null);
        });
    }

    private playBGM(bgm: IPlayBGM, callback: ActionCallback): void {
        if (!bgm) {
            safecall(callback, new Error(`ComADVGame.playBGM: invalid BGM to play.`));
            return;
        }
        const audio: IAudio = AudioManager.instance.get(bgm.name);
        if (isNone(audio)) {
            safecall(callback, new Error(`ComADVGame.playBGM: not found audio "${bgm.name}".`));
            return;
        }
        ResourceLoader.instance.load(audio.res, cc.AudioClip, (err: Error, clip: cc.AudioClip) => {
            if (!isNone(err)) {
                safecall(callback, new Error(`ComADVGame.playBGM: ${err}`));
                return;
            }
            cc.audioEngine.playMusic(clip, true);
            safecall(callback, null);
        });
    }

    private showContent(content: IContent, callback: ActionCallback): void {
        if (!content) {
            safecall(callback, new Error(`ComADVGame.showContent: invalid plot text content to show.`));
            return;
        }

        if (!isNone(content.character)) {
            const character: ICharacter = CharacterManager.instance.get(content.character.name);
            if (this.characterNameTag && !isNone(character) && !isNone(character.characterName)) {
                this.characterNameTag.string = getTextByLanguage(character.characterName);
            }
            ResourceLoader.instance.load(character.image.res, cc.SpriteFrame, (err: Error, asset: cc.SpriteFrame) => {
                if (!isNone(err)) {
                    safecall(callback, new Error(`ComADVGame.showContent: ${err}`));
                    return;
                }
                const characterPos: CharacterPosition = this.characterPosList[content.character.pos];
                this.character.spriteFrame = asset;
                this.character.node.setPosition(cc.v2(
                    characterPos.pos.x,
                    characterPos.pos.y,
                ));
                this.character.node.setScale(cc.v2(
                    character.image.scale.x,
                    character.image.scale.y,
                ));
                safecall(callback, null);
            });
        }

        if (!isNone(content.text)) {
            this.plotText.string = getTextByLanguage(content.text);
        }
    }

    private onActionCallback(err?: Error): void {
        if (isNone(err)) {
            this.goon();
        } else {
            console.error(`ComADVGame.onActionCallback: ${err}`);
        }
    }

    public goon(): void {
        try {
            const plot: Plot = PlotManager.instance.get(this.progress.plotID);
            this.progress.actionIndex++;
            this.playPlot(plot);
        } catch (e) {
            console.error(`ComADVGame.goon: ${e}`);
        }
    }
    
}
