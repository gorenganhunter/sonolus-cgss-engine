import { options } from "../../../../configuration/options.js";
import { note } from "../../../note.js";
import { panel } from "../../../panel.js";
import { skin, getZ, layer } from "../../../skin.js";
import { Note } from "../Note.js";

export class FlickNote extends Note {
    sprite = skin.sprites.flickLeftNote

    flickImport = this.defineImport({
        direction: { name: "direction", type: Number },
        nextRef: { name: "next", type: Number }
    })

    render() {
        const time = bpmChanges.at(this.import.beat).time
        const pos = panel.getPos(time)

        const z = getZ(layer.note.body, time, this.import.lane)

        if (this.flickImport.direction < 0) skin.sprites.flickLeftNote.draw(
            new Rect({
                l: this.import.lane - 0.5 * 1.4 * this.import.size / 100 /* options.noteSize*/,
                r: this.import.lane + 0.5 * this.import.size / 100 /* options.noteSize*/,
                b: -note.h /* options.noteSize*/,
                t: note.h /* options.noteSize*/,
            }).add(pos),
            z,
            1,
        )
        else skin.sprites.flickRightNote.draw(
            new Rect({
                l: this.import.lane - 0.5 * this.import.size / 100 /* options.noteSize*/,
                r: this.import.lane + 0.5 * 1.4 * this.import.size / 100 /* options.noteSize*/,
                b: -note.h /* options.noteSize*/,
                t: note.h /* options.noteSize*/,
            }).add(pos),
            z,
            1,
        )


        return { time, pos }
    }
}
