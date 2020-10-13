import { ResourceManager } from "./ResourceManager";

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

export class PlotManager extends ResourceManager<Plot> {

    public static readonly BEGIN_PLOT_ID: string = "begin";

    public static readonly instance: PlotManager = new PlotManager();

    protected resDataFile: string = "plot";

    private constructor() {
        super();
    }

    public goon(): void {
        try {

        } catch (e) {
            console.error(`PlotManager.goon: ${e}`);
        }
    }

}
