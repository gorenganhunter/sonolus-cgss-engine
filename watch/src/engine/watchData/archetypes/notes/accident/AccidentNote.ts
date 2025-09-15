import { Bucket, JudgmentWindows, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { Note } from "../Note";
import { skin } from "../../../skin";
import { buckets } from "../../../buckets";
import { note } from "../../../note";
import { options } from "../../../../configuration/options";
import { effect } from "../../../effect";

export class AccidentNote extends Note {
    sprite: SkinSprite = skin.sprites.accidentNote

    windows: JudgmentWindows = {
        perfect: Range.zero,
        great: Range.zero,
        good: Range.one.mul(0.1),
    }

    bucket: Bucket = buckets.accidentNote

    damageImport = this.defineImport({
        hitTime: { name: 'hitTime', type: Number },
    })

    globalPreprocess() {
        this.life.miss = -40
    }

    get shouldScheduleSFX() {
        return !!(replay.isReplay && options.sfxEnabled && !this.import.judgment)
    }

    scheduleSFX(): void {
        effect.clips.miss.schedule(this.targetTime, 0.02)
    }
}

export class FakeAccidentNote extends AccidentNote {
    hasInput: boolean = false
}
