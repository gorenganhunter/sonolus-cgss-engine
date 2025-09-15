import { buckets } from "../../../buckets";
import { note } from "../../../note";
import { SlideEndFlickNote } from "../slide/SlideEndFlickNote";

export class HoldEndFlickNote extends SlideEndFlickNote {
    bucket = buckets.holdEndFlickNote
}

export class FakeHoldEndFlickNote extends HoldEndFlickNote {
    hasInput: boolean = false
}
