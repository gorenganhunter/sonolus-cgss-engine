import { LevelData, LevelDataEntity } from '@sonolus/core'
import { CsvNoteData, CsvNoteStatus, CsvNoteType } from './index.js'

export function csvToLevelData(chart: string, offset = 0, circleType: number = 4): LevelData {
    const arr = chart.split("\n").map(n => n.split(","))
    const n = arr.map(a => a.map(x => parseFloat(x)))

    let notes: CsvNoteData[] = []

    n.forEach((a, i) => {
        if (i > 2) {
            const o: any = {}
            arr[0].forEach((k, i) => {
                o[k] = a[i]
            })
            notes.push(o)
        }
    })

    let data: LevelData = {
        bgmOffset: offset,
        entities: [
            {
                archetype: "Initialization",
                data: [
                    {
                        name: "noteCount",
                        value: parseInt(arr[1][5])
                    },
                    {
                        name: "circleType",
                        value: circleType
                    }
                ],
            },
            {
                archetype: "Stage",
                data: [],
            },
            {
                archetype: "#BPM_CHANGE",
                data: [
                    {
                        name: "#BEAT",
                        value: 0,
                    },
                    {
                        name: "#BPM",
                        value: 60,
                    },
                ],
            },
        ],
    };

    data.entities.push(...ts(notes), ...note(notes))

    return data
}

function ts(n: CsvNoteData[]): LevelDataEntity[] {
    let tsc = n.filter(({ type }) => type === CsvNoteType.TIMESCALE)

    return tsc.map(({ sec, status }) => ({
        archetype: "#TIMESCALE_CHANGE",
        data: [
            {
                name: "#BEAT",
                value: sec
            },
            {
                name: "#TIMESCALE",
                value: status / 100
            }
        ]
    }))
}

function note(n: CsvNoteData[]): LevelDataEntity[] {
    let hold: any = {};
    let group: any = {};

    n = n.filter(({ type }) => type < 10)

    n.forEach(({ id, type, status, groupId, finishPos }) => {
        let used = false
        Object.keys(hold).forEach(k => {
            if (!hold[k] && n.find(({ id: aid }) => aid === parseInt(k))?.finishPos === finishPos) {
                hold[k] = id
                used = true
            }
        })

        if (type === CsvNoteType.HOLD && !used) {
            hold[id] = 0
        }

        if (groupId) {
            if (!group[groupId]) group[groupId] = [id]
            else group[groupId].push(id)
        }
    })

    let notes: any = {};
    let nots = n.map(({ id, sec, sync, type, status, groupId, startPos, finishPos, visible, size }) => {
        const not: LevelDataEntity = {
            archetype: type === CsvNoteType.DECORATOR ? "Decorator" : type === CsvNoteType.ACCIDENT ? "AccidentNote" : type === CsvNoteType.TAP_FLICK ? status === CsvNoteStatus.TAP ? "TapNote" : Object.values(hold).includes(id) ? "HoldEndFlickNote" : (group[groupId].includes(id) && group[groupId][0].type === CsvNoteType.SLIDE) ? "SlideEndFlickNote" : "FlickNote" : type === CsvNoteType.HOLD ? Object.values(hold).includes(id) ? "HoldEndNote" : "HoldStartNote" : group[groupId].indexOf(id) ? group[groupId].indexOf(id) === (group[groupId].length - 1) ? status === CsvNoteStatus.TAP ? "SlideEndNote" : "SlideEndFlickNote" : "SlideTickNote" : "SlideStartNote",
            data: [
                {
                    name: "#BEAT",
                    value: sec,
                },
                {
                    name: "lane",
                    value: finishPos - 3,
                },
                {
                    name: "spawnLane",
                    value: startPos - 3,
                },
            ],

            name: `note:${id}`,
        };

        if (visible < 0 && type !== CsvNoteType.DECORATOR) not.archetype = "Fake" + not.archetype

        if (visible) not.data.push({
            name: "visible",
            value: visible
        })

        if (size) not.data.push({
            name: "size",
            value: size
        })

        if (type === CsvNoteType.DECORATOR) not.data.push({
            name: "color",
            value: status
        })

        if (sync) notes[sec]
            ? notes[sec].push({ name: `note:${id}`, lane: finishPos })
            : (notes[sec] = [{ name: `note:${id}`, lane: finishPos }]);

        if (Object.keys(hold).includes(id.toString())) {
            not.data.push({
                name: "tail",
                ref: `note:${hold[id]}`,
            });
            not.data.push({
                name: "next",
                ref: `note:${hold[id]}`,
            });
        }

        if (Object.values(hold).includes(id)) {
            const h = Object.entries(hold).find(([k, v]) => v === id)![0]
            not.data.push({
                name: "head",
                ref: `note:${h}`,
            });
            not.data.push({
                name: "prev",
                ref: `note:${h}`,
            });
        }

        if ((type === CsvNoteType.TAP_FLICK || type === CsvNoteType.SLIDE) && status !== CsvNoteStatus.TAP) not.data.push({
            name: "direction",
            value: status === CsvNoteStatus.FLICK_L ? -1 : 1
        })

        if (groupId) {
            const index = group[groupId].indexOf(id)

            if (index) not.data.push({
                name: "head",
                ref: `note:${group[groupId][0]}`
            }, {
                name: "prev",
                ref: `note:${group[groupId][index - 1]}`
            })

            if (index < group[groupId].length - 1) not.data.push({
                name: "tail",
                ref: `note:${group[groupId][group[groupId].length - 1]}`
            }, {
                name: "next",
                ref: `note:${group[groupId][index + 1]}`
            })
        }

        return not;
    });

    Object.entries(hold).forEach(([head, tail]) => {
        const index = nots.findIndex(({ name }) => name === `note:${head}`)
        nots.splice(index + 1, 0, {
            archetype: "HoldConnector",
            data: [
                {
                    name: "head",
                    ref: `note:${head}`,
                },
                {
                    name: "tail",
                    ref: `note:${tail}`,
                },
                {
                    name: "prev",
                    ref: `note:${head}`,
                },
                {
                    name: "next",
                    ref: `note:${tail}`,
                },
            ],
        })
    });

    Object.entries(group).forEach(([id, notes]: any[]) => {
        const head = notes[0]
        const tail = notes[notes.length - 1]

        notes.forEach((nid: number, i: number) => {
            if (i < notes.length - 1) {
                const index = nots.findIndex(({ name }) => name === `note:${nid}`)
                const note = n.find(not => not.id === nid)

                const entity = {
                    archetype: note?.type === CsvNoteType.SLIDE ? "SlideConnector" : note?.type === CsvNoteType.TAP_FLICK ? "FlickConnector" : "DecoratorConnector",
                    data: [
                        {
                            name: "head",
                            ref: `note:${head}`,
                        },
                        {
                            name: "tail",
                            ref: `note:${tail}`,
                        },
                        {
                            name: "prev",
                            ref: `note:${nid}`,
                        },
                        {
                            name: "next",
                            ref: `note:${notes[i + 1]}`,
                        },
                    ],
                }

                nots.splice(index + 1, 0, entity)
            }
        });
    });

    for (const beat in notes) {
        const sim = notes[beat].sort((a: any, b: any) => a.lane - b.lane);
        nots.push({
            archetype: "SimLine",
            data: [
                {
                    name: "a",
                    ref: sim[0].name,
                },
                {
                    name: "b",
                    ref: sim[1].name,
                },
            ],
        });
    }

    return nots;
}
