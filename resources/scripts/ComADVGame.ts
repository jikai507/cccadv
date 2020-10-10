const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComADVGame")
export class ComADVGame extends cc.Component {

    protected start(): void {
        console.info("ADV game start");
    }
    
}
