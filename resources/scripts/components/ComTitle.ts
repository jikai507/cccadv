const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComTitle")
export class ComTitle extends cc.Component {

    @property({ visible: true })
    private gameSceneName: string = "game";

    protected onLoad(): void {
        try {
            cc.director.getPhysicsManager().enabled = false;
            cc.debug.setDisplayStats(false);
        } catch (e) {
            console.error(`ComTitle.onLoad: ${e}`);
        }
    }

    public newGame(): void {
        cc.director.loadScene(this.gameSceneName, () => {
            cc.director.emit("new_game");
        });
    }

    public loadGame(): void {
        
    }
    
}
