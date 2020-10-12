import { Canvas } from "../Canvas";
import { ComButton } from "./ComButton";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComOpenPageButton")
export class ComOpenPageButton extends ComButton {

    @property({ visible: true, type: cc.Prefab })
    private pagePrefab: cc.Prefab = null;

    protected onClicked(): void {
        try {
            if (!this.pagePrefab) {
                return;
            }
            const page: cc.Node = cc.instantiate(this.pagePrefab);
            const canvas: cc.Canvas = Canvas.instance.getCurCanvas();
            if (canvas) {
                canvas.node.addChild(page);
            }
        } catch (e) {
            console.error(`ComOpenPageButton.onClicked: ${e}`);
        }
    }

}
