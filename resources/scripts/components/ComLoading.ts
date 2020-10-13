import { CharacterManager } from "../Character";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComLoading")
export class ComLoading extends cc.Component {

    private static readonly INIT_MANAGER_COUNT: number = 1;

    protected onLoad(): void {
        try {
            let overCount: number = 0;

            CharacterManager.instance.init((err?: string) => {
                if (!err) {
                    console.debug(`character manager init over.`);
                    overCount++;
                    this._onManagerInitOver(overCount);
                } else {
                    console.error(`character manager init failed.`);
                }
            });
        } catch (e) {
            console.error(`ComLoading.onLoad: ${e}`);
        }
    }

    private _onManagerInitOver(overCount: number): void {
        if (overCount >= ComLoading.INIT_MANAGER_COUNT) {
            cc.director.loadScene("title");
        }
    }
    
}
