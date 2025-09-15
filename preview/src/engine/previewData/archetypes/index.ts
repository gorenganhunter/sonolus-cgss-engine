import { Initialization } from './Initialization.js'
import { Stage } from './Stage.js'
import { BarLine } from './lines/BarLine.js'
import { SimLine } from './lines/SimLine.js'
import { EngineArchetypeName } from '@sonolus/core'
import { TimeScaleChange } from './TimeScaleChange.js'
import { BaseConnector } from './connectors/BaseConnector.js'
import { BpmChange } from './BpmChange.js'
import { TapNote } from './notes/tap/TapNote.js'
import { HoldNote } from './notes/hold/HoldNote.js'
import { SlideNote } from './notes/slide/SlideNote.js'
import { FlickNote } from './notes/flick/FlickNote.js'
import { FlickConnector } from './connectors/FlickConnector.js'
import { AccidentNote } from './notes/accident/AccidentNote.js'

export const archetypes = defineArchetypes({
    Initialization,
    Stage,

    TapNote,
    FlickNote,

    AccidentNote,

    HoldStartNote: HoldNote,
    HoldEndNote: HoldNote,
    HoldEndFlickNote: FlickNote,

    SlideStartNote: SlideNote,
    SlideEndNote: SlideNote,
    SlideTickNote: SlideNote,
    SlideEndFlickNote: FlickNote,

    HoldConnector: BaseConnector,
    SlideConnector: BaseConnector,
    FlickConnector,

    BarLine,
    SimLine,

    [EngineArchetypeName.TimeScaleChange]: TimeScaleChange,
    [EngineArchetypeName.BpmChange]: BpmChange
})
