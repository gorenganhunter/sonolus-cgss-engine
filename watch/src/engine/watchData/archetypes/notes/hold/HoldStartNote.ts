import { buckets } from "../../../buckets";
import { skin } from "../../../skin";
import { SlideStartNote } from "../slide/SlideStartNote";

export class HoldStartNote extends SlideStartNote {
    bucket = buckets.holdStartNote

    sprite: SkinSprite = skin.sprites.holdNote
}

export class FakeHoldStartNote extends HoldStartNote {
    hasInput: boolean = false
}
