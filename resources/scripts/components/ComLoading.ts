import { AudioManager } from "../Audio";
import { BackgroundManager } from "../Background";
import { CharacterManager } from "../Character";
import { IInitRequired } from "../Interfaces";
import { PlotManager } from "../Plot";
import { ResourceManager } from "../ResourceManager";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComLoading")
export class ComLoading extends cc.Component {

    protected onLoad(): void {
        try {
            let overCount: number = 0;
            const initEntries: Array<IInitRequired> = [
                BackgroundManager.instance,
                AudioManager.instance,
                CharacterManager.instance,
                PlotManager.instance,
            ];
            for (let i = 0; i < initEntries.length; i++) {
                const entry: IInitRequired = initEntries[i];
                entry.init((err?: string) => {
                    if (!err) {
                        overCount++;
                        this._onManagerInitOver(overCount, initEntries.length);
                    } else {
                        console.error(err);
                    }
                });
            }
        } catch (e) {
            console.error(`ComLoading.onLoad: ${e}`);
        }
    }

    private _onManagerInitOver(overCount: number, totalCount: number): void {
        if (overCount >= totalCount) {
            cc.director.loadScene("title");
        }
    }
    
}
