const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComTitle")
export class ComTitle extends cc.Component {

    protected onLoad(): void {
        try {
            cc.director.getPhysicsManager().enabled = false;
            cc.debug.setDisplayStats(false);
        } catch (e) {
            console.error(`ComTitle.onLoad: ${e}`);
        }
    }

    public newGame(): void {

    }

    public loadGame(): void {
        
    }
    
}
