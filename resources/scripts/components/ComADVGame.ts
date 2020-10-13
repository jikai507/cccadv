import { CharacterManager, ICharacter } from "../Character";
import { IContent, IPlotAction, Plot, PlotManager } from "../Plot";
import { isNone } from "../Util";

const {ccclass, property, menu} = cc._decorator;

@ccclass("PlotProgress")
class PlotProgress {

    @property({ visible: true })
    public plotID: string = PlotManager.BEGIN_PLOT_ID;

    @property({ visible: true, type: cc.Integer, min: 0 })
    public actionIndex: number = 0;

    @property({ visible: true })
    public autoSave: boolean = false;

}

@ccclass
@menu("cccadv/ComADVGame")
export class ComADVGame extends cc.Component {

    @property({ visible: true, type: cc.Sprite })
    private background: cc.Sprite = null;

    @property({ visible: true, type: cc.Sprite })
    private character: cc.Sprite = null;

    @property({ visible: true, type: cc.RichText })
    private characterNameTag: cc.RichText = null;

    @property({ visible: true, type: cc.RichText })
    private plotText: cc.RichText = null;

    @property({ visible: true, type: PlotProgress })
    private progress: PlotProgress = new PlotProgress();

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
            const plot: Plot = PlotManager.instance.getPlot(PlotManager.BEGIN_PLOT_ID);
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
            this.progress.actionIndex++;
            
            switch (plotAction.type) {
            case "background":
                break;
            case "bgm":
                break;
            case "soundeffect":
                break;
            case "content":
                this.showContent(plotAction as IContent);
                break;
            case "selection":
                break;
            }
        } catch (e) {
            console.error(`ComADVGame.playPlot: ${e}`);
        }
    }

    private showContent(content: IContent): void {
        if (!content) {
            return;
        }
        if (!isNone(content.character)) {
            const character: ICharacter = CharacterManager.instance.getCharacter(content.character);
            console.info(character);
        }
        if (!isNone(content.text)) {
            this.plotText.string = content.text;
        }
    }

    public plotGoon(): void {
        console.info("goon");
    }
    
}
