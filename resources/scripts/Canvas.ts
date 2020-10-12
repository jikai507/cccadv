export class Canvas {

    public static readonly SCENE_CANVAS_NAME: string = "Canvas";

    public static readonly instance: Canvas = new Canvas();

    private constructor() {}

    public getCurCanvas(): cc.Canvas {
        try {
            const scene: cc.Scene = cc.director.getScene();
            if (undefined === scene || null === scene) {
                throw `no scene?`;
            }
            const canvasNode: cc.Node = scene.getChildByName(Canvas.SCENE_CANVAS_NAME);
            if (undefined === canvasNode || null === canvasNode) {
                throw `not found canvas node named "${Canvas.SCENE_CANVAS_NAME}".`;
            }
            const canvas: cc.Canvas = canvasNode.getComponent(cc.Canvas);
            if (undefined === canvas || null === canvas) {
                throw `canvas node not have cc.Canvas component.`;
            }
            return canvas;
        } catch (e) {
            console.error(`Canvas.getCurCanvas: ${e}`);
            return null;
        }
    }

}
