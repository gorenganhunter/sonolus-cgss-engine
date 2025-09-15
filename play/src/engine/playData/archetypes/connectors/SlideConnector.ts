import { skin } from "../../skin";
import { BaseConnector } from "./BaseConnector";

export class SlideConnector extends BaseConnector {
    initialize(): void {
        super.initialize()
        this.sprite.slide = skin.sprites.slideNote.id
    }
}
