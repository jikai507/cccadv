import { IInitRequired, ITable } from "./Interfaces";
import { isNone } from "./Util";

export type Plot = Array<IPlotAction>;

export interface IPlotAction {
    readonly type: "background" | "bgm" | "soundeffect" | "content" | "selection";
}

export interface ISetBackground extends IPlotAction {
    readonly name: string;
}

export interface IPlayBGM extends IPlotAction {
    readonly name: string;
}

export interface IPlaySoundEffect extends IPlotAction {
    readonly name: string;
}

export interface IContent extends IPlotAction {

    readonly character?: string;

    readonly text?: string;
    
}

export interface ISellections extends IPlotAction {

}

export interface ICondition extends IPlotAction {
    
}

export class PlotManager implements IInitRequired {

    public static readonly BEGIN_PLOT_ID: string = "begin";

    public static readonly instance: PlotManager = new PlotManager();

    private curPlotID: string = PlotManager.BEGIN_PLOT_ID;

    private plots: ITable<Plot> = {};

    private constructor() {}

    public init(over: (err?: string) => void) {
        cc.resources.load("data/plot", cc.JsonAsset, (err: Error, asset: cc.JsonAsset) => {
            if (err) {
                over(`PlotManager.init: load json asset failed. ${err}`);
                return;
            }
            if (isNone(asset) || isNone(asset.json)) {
                over(`PlotManager.init: invalid data.`);
                return;
            }
            this.plots = asset.json;
            over();
        });
    }

    public getPlot(id: string): Plot {
        try {
            if (!id) {
                throw `invalid plot id.`;
            }
            const plot: Plot = this.plots[id];
            if (isNone(plot)) {
                throw `not found plot "${id}".`;
            }
            return plot;
        } catch (e) {
            console.error(`PlotManager.getPlot: ${e}`);
            return null;
        }
    }

    public goon(): void {
        try {

        } catch (e) {
            console.error(`PlotManager.goon: ${e}`);
        }
    }

}
