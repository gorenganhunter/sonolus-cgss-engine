import { buckets } from "../../../buckets";
import { skin } from "../../../skin";
import { SlideEndNote } from "../slide/SlideEndNote";

export class HoldEndNote extends SlideEndNote {
    bucket = buckets.holdEndNote

    sprite: SkinSprite = skin.sprites.holdNote
}

export class FakeHoldEndNote extends HoldEndNote {
    hasInput: boolean = false
}
