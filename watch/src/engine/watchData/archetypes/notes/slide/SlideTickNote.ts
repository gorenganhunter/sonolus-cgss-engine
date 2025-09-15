import { JudgmentWindows, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { SlideNote } from "./SlideNote";
import { skin } from "../../../skin";
import { windows } from "../../../../../../../shared/src/engine/data/windows";
import { buckets } from "../../../buckets";

export class SlideTickNote extends SlideNote {
    sprite: SkinSprite = skin.sprites.slideTick
    bucket: Bucket = buckets.slideTickNote

}

export class FakeSlideTickNote extends SlideTickNote {
    hasInput: boolean = false
}
