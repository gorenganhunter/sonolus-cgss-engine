import { EngineDataBucket, Text } from '@sonolus/core'

export const createBucketDefinition = (
    sprites: Record<'tapNote' | 'flickLeftNote' | 'flickRightNote' | 'holdNote' | 'slideNote' | 'connector' | 'slideTick' | 'accidentNote', { id: number }>,
) =>
    ({
        tapNote: {
            sprites: [
                {
                    id: sprites.tapNote.id,
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        flickNote: {
            sprites: [
                {
                    id: sprites.flickLeftNote.id,
                    x: -1.5,
                    y: 0,
                    w: 2.4,
                    h: 2,
                    rotation: 0,
                },
                {
                    id: sprites.flickRightNote.id,
                    x: 1.5,
                    y: 0,
                    w: 2.4,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        holdStartNote: {
            sprites: [
                {
                    id: sprites.connector.id,
                    x: 0.5,
                    y: 0,
                    w: 2,
                    h: 5,
                    rotation: -90,
                },
                {
                    id: sprites.holdNote.id,
                    x: -2,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        holdEndNote: {
            sprites: [
                {
                    id: sprites.connector.id,
                    x: -0.5,
                    y: 0,
                    w: 2,
                    h: 5,
                    rotation: -90,
                },
                {
                    id: sprites.holdNote.id,
                    x: 2,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        holdEndFlickNote: {
            sprites: [
                {
                    id: sprites.connector.id,
                    x: -0.5,
                    y: 0,
                    w: 2,
                    h: 5,
                    rotation: -90,
                },
                {
                    id: sprites.flickRightNote.id,
                    x: 2,
                    y: -0.2,
                    w: 2,
                    h: 2.4,
                    rotation: 90,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        slideStartNote: {
            sprites: [
                {
                    id: sprites.connector.id,
                    x: 0.5,
                    y: 0,
                    w: 2,
                    h: 5,
                    rotation: -90,
                },
                {
                    id: sprites.slideNote.id,
                    x: -2,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        slideTickNote: {
            sprites: [
                {
                    id: sprites.connector.id,
                    x: 0,
                    y: 0,
                    w: 5,
                    h: 2,
                    rotation: 0,
                },
                {
                    id: sprites.slideTick.id,
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        slideEndNote: {
            sprites: [
                {
                    id: sprites.connector.id,
                    x: -0.5,
                    y: 0,
                    w: 2,
                    h: 5,
                    rotation: -90,
                },
                {
                    id: sprites.slideNote.id,
                    x: 2,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        slideEndFlickNote: {
            sprites: [
                {
                    id: sprites.connector.id,
                    x: -0.5,
                    y: 0,
                    w: 2,
                    h: 5,
                    rotation: -90,
                },
                {
                    id: sprites.flickRightNote.id,
                    x: 2,
                    y: -0.2,
                    w: 2,
                    h: 2.4,
                    rotation: 90,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        accidentNote: {
            sprites: [
                {
                    id: sprites.accidentNote.id,
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
    }) as const satisfies Record<string, EngineDataBucket>
