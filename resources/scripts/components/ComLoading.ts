import { AudioManager } from "../Audio";
import { BackgroundManager } from "../Background";
import { CharacterManager } from "../Character";
import { IInitRequired } from "../Interfaces";
import { ItemManager } from "../Item";
import { PlotManager } from "../Plot";
import { PropertyManager } from "../Property";
import { isNone } from "../Util";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComLoading")
export class ComLoading extends cc.Component {

    protected onLoad(): void {
        this.init();
    }

    private init(): void {
        try {
            let overCount: number = 0;
            const initEntries: Array<IInitRequired> = [
                BackgroundManager.instance,
                AudioManager.instance,
                CharacterManager.instance,
                ItemManager.instance,
                PropertyManager.instance,
                PlotManager.instance,
            ];
            for (let i = 0; i < initEntries.length; i++) {
                const entry: IInitRequired = initEntries[i];
                entry.init((err?: Error) => {
                    if (isNone(err)) {
                        overCount++;
                        this._onManagerInitOver(overCount, initEntries.length);
                    } else {
                        console.error(err);
                    }
                });
            }
        } catch (e) {
            console.error(`ComLoading.init: ${e}`);
        }
    }

    private _onManagerInitOver(overCount: number, totalCount: number): void {
        if (overCount >= totalCount) {
            this.preload();
        }
    }

    private preload(): void {
        try {
            let overCount: number = 0;
            let totalCount: number = 0;
            const initEntries: Array<IInitRequired> = [
                BackgroundManager.instance,
                AudioManager.instance,
                CharacterManager.instance,
                ItemManager.instance,
                PropertyManager.instance,
                PlotManager.instance,
            ];
            for (let i = 0; i < initEntries.length; i++) {
                const entry: IInitRequired = initEntries[i];
                totalCount += entry.preload((err?: Error) => {
                    if (isNone(err)) {
                        overCount++;
                        this._onManagerPreloadOver(overCount, totalCount);
                    } else {
                        console.error(err);
                    }
                });
            }
        } catch (e) {
            console.error(`ComLoading.preload: ${e}`);
        }
    }

    private _onManagerPreloadOver(overCount: number, totalCount: number): void {
        if (overCount >= totalCount) {
            cc.director.loadScene("title");
        }
    }
    
}
