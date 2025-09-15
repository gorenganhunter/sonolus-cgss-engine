import { windows } from '../../../../../../../shared/src/engine/data/windows.js'
import { buckets } from '../../../buckets.js'
import { skin } from '../../../skin.js'
import { Note } from '../Note.js'
// import { SingleNote } from './SingleNote.js'

export class TapNote extends Note {
    windows = windows.tapNote

    bucket = buckets.tapNote

    sprite = skin.sprites.tapNote
}

export class FakeTapNote extends TapNote {
    hasInput: boolean = false
}
