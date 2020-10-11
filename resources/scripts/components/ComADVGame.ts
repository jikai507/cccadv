const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComADVGame")
export class ComADVGame extends cc.Component {

    @property({ visible: true, type: cc.Sprite })
    private background: cc.Sprite = null;

    @property({ visible: true, type: cc.Sprite })
    private character: cc.Sprite = null;

    protected start(): void {
        console.info("ADV game start");
    }
    
}
