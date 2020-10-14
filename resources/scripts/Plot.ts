import { ILocaleText } from "./Interfaces";
import { ResourceData } from "./Resource";

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

    readonly text?: ILocaleText;
    
}

export interface ISellections extends IPlotAction {

}

export interface ICondition extends IPlotAction {
    
}

export class PlotManager extends ResourceData<Plot> {

    public static readonly BEGIN_PLOT_ID: string = "begin";

    public static readonly instance: PlotManager = new PlotManager();

    protected readonly resDataFile: string = "plot";

    private constructor() {
        super();
    }

    protected getResPaths(entry: Plot): Array<string> {
        return [];
    }

    public goon(): void {
        try {

        } catch (e) {
            console.error(`PlotManager.goon: ${e}`);
        }
    }

}
