const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("cccadv/ComArchive")
export class ComArchive extends cc.Component {

    @property({ visible: true, type: cc.Integer, min: 1, max: 100 })
    private maxPos: number = 16;

    @property({ visible: true, type: cc.Integer, min: 1, max: 100 })
    private unlockedPos: number = 4;

    protected start(): void {
        if (this.unlockedPos > this.getMaxPos()) {
            console.error(`ComArchive.start: unlocked pos is more than max pos?`);
        }
    }

    public getMaxPos(): number {
        return this.maxPos;
    }

    public canUsePos(pos: number): boolean {
        if (undefined === pos || null === pos) {
            return false;
        }
        return (0 <= pos && pos <= this.unlockedPos);
    }

    public setUnlockedPos(count: number): void {
        if (count <= this.unlockedPos || count > this.getMaxPos()) {
            return;
        }
        this.unlockedPos = count;
    }

    public save(pos: number): void {
        try {
            if (!this.canUsePos(pos)) {
                throw `pos ${pos} is not unlocked.`;
            }
        } catch (e) {
            console.error(`ComArchive.save: ${e}`);
        }
    }

    public load(pos: number): void {
        try {
            if (!this.canUsePos(pos)) {
                throw `pos ${pos} is not unlocked.`;
            }
        } catch (e) {
            console.error(`ComArchive.save: ${e}`);
        }
    }

}
