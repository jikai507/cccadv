import { ITable } from "./Interfaces";

export interface IPlot {
    readonly actions: Array<IPlotAction>;
}

export interface IPlotAction {
    readonly type: string;
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

export interface IContentText extends IPlotAction {

    readonly text: string;

    readonly character?: string;
    
}

export interface ISellections extends IPlotAction {

}

export interface ICondition extends IPlotAction {
    
}

export class PlotManager {

    public static readonly BEGIN_PLOT_ID: string = "begin";

    public static readonly instance: PlotManager = new PlotManager();

    private curPlotID: string = PlotManager.BEGIN_PLOT_ID;

    private plots: ITable<IPlot> = {};

    private constructor() {}

    public goon(): void {
        try {

        } catch (e) {
            console.error(`PlotManager.goon: ${e}`);
        }
    }

}
