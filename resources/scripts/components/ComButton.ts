const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComButton")
export abstract class ComButton extends cc.Component {

    protected onLoad(): void {
        try {
            this.node.on(cc.Node.EventType.TOUCH_END, this.onClicked.bind(this), this);
        } catch (e) {
            console.error(`ComButton.onLoad: ${e}`);
        }
    }

    protected abstract onClicked(): void;
    
}
