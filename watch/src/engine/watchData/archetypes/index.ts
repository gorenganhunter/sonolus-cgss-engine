import { DecoratorConnector } from './connectors/DecoratorConnector.js'
import { FlickConnector } from './connectors/FlickConnector.js'
import { HoldConnector } from './connectors/HoldConnector.js'
import { SlideConnector } from './connectors/SlideConnector.js'
import { Initialization } from './Initialization.js'
import { AccidentNote, FakeAccidentNote } from './notes/accident/AccidentNote.js'
import { Decorator } from './notes/Decorator.js'
import { FakeFlickNote, FlickNote } from './notes/flick/FlickNote.js'
import { FakeHoldEndFlickNote, HoldEndFlickNote } from './notes/hold/HoldEndFlickNote.js'
import { FakeHoldEndNote, HoldEndNote } from './notes/hold/HoldEndNote.js'
import { FakeHoldStartNote, HoldStartNote } from './notes/hold/HoldStartNote.js'
import { FakeSlideEndFlickNote, SlideEndFlickNote } from './notes/slide/SlideEndFlickNote.js'
import { FakeSlideEndNote, SlideEndNote } from './notes/slide/SlideEndNote.js'
import { FakeSlideStartNote, SlideStartNote } from './notes/slide/SlideStartNote.js'
import { FakeSlideTickNote, SlideTickNote } from './notes/slide/SlideTickNote.js'
import { FakeTapNote, TapNote } from './notes/tap/TapNote.js'
import { SimLine } from './SimLine.js'
import { Stage } from './Stage.js'

export const archetypes = defineArchetypes({
    Initialization,
    Stage,

    TapNote,
    FlickNote,
    AccidentNote,

    HoldStartNote,
    HoldEndNote,
    HoldEndFlickNote,

    SlideStartNote,
    SlideTickNote,
    SlideEndNote,
    SlideEndFlickNote,

    HoldConnector,
    SlideConnector,
    FlickConnector,

    FakeTapNote,
    FakeFlickNote,
    FakeAccidentNote,

    FakeHoldStartNote,
    FakeHoldEndNote,
    FakeHoldEndFlickNote,

    FakeSlideStartNote,
    FakeSlideTickNote,
    FakeSlideEndNote,
    FakeSlideEndFlickNote,

    Decorator,
    DecoratorConnector,

    SimLine
})
