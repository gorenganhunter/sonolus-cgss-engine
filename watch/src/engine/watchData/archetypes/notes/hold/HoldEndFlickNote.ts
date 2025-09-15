import { Bucket, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { buckets } from "../../../buckets";
import { HoldEndNote } from "./HoldEndNote";
import { getZ, layer, skin } from "../../../skin";
import { scaledScreen } from "../../../scaledScreen";
import { leftRotated, rightRotated } from "../../../../../../../shared/src/engine/data/utils";
import { SlideEndFlickNote } from "../slide/SlideEndFlickNote";

export class HoldEndFlickNote extends SlideEndFlickNote {
    bucket: Bucket = buckets.holdEndFlickNote
}

export class FakeHoldEndFlickNote extends HoldEndFlickNote {
    hasInput: boolean = false
}
