export type CsvNoteData = {
    id: number;
    sec: number;
    type: CsvNoteType;
    startPos: 1 | 2 | 3 | 4 | 5;
    finishPos: 1 | 2 | 3 | 4 | 5;
    status: CsvNoteStatus | number;
    sync: 0 | 1;
    groupId: number;
    visible: number;
    size: number;
    distance: number;
};

export enum CsvNoteType {
    TAP_FLICK = 1,
    HOLD = 2,
    SLIDE = 3,
    ACCIDENT = 8,
    DECORATOR = 9,
    TIMESCALE = 93
}

export enum CsvNoteStatus {
    TAP = 0,
    FLICK_L = 1,
    FLICK_R = 2,
}
