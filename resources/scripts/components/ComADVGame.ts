import { CharacterManager, ICharacter } from "../Character";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComADVGame")
export class ComADVGame extends cc.Component {

    @property({ visible: true, type: cc.Sprite })
    private background: cc.Sprite = null;

    @property({ visible: true, type: cc.Sprite })
    private character: cc.Sprite = null;

    protected onLoad(): void {
        try {

        } catch (e) {
            console.error(`ComADVGame.onLoad: ${e}`);
        }
    }

    protected start(): void {
        const char: ICharacter = CharacterManager.instance.getCharacter("xiao_wang");
        console.info(char);
    }
    
}
