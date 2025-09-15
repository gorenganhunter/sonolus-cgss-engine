import { windows } from "../../../../../../../shared/src/engine/data/windows";
import { buckets } from "../../../buckets";
import { note } from "../../../note";
import { skin } from "../../../skin";
import { SlideStartNote } from "../slide/SlideStartNote";

export class HoldStartNote extends SlideStartNote {
    bucket = buckets.holdStartNote

    windows = windows.holdNote

    sprite: SkinSprite = skin.sprites.holdNote
}

export class FakeHoldStartNote extends HoldStartNote {
    hasInput: boolean = false
}
