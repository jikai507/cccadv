import { ComButton } from "./ComButton";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComClosePageButton")
export class ComClosePageButton extends ComButton {

    @property({ visible: true, type: cc.Node })
    private pageRootNode: cc.Node = null;

    protected onClicked(): void {
        try {
            if (this.pageRootNode) {
                this.pageRootNode.destroy();
            }
        } catch (e) {
            console.error(`ComClosePageButton.onClicked: ${e}`);
        }
    }
    
}
