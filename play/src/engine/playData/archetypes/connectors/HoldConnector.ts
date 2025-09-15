import { skin } from "../../skin";
import { BaseConnector } from "./BaseConnector";

export class HoldConnector extends BaseConnector {
    initialize(): void {
        super.initialize()
        this.sprite.slide = -1 as SkinSpriteId
    }
}
