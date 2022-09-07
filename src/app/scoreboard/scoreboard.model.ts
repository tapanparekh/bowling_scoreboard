export interface Frame {
    id: number;
    firstRoll: Roll;
    secondRoll: Roll;
    score: number;
    isActive: boolean;
}

export interface Roll {
    isattempted: boolean;
    score: number;
}

export interface Score {
    frames: Frame[];
    totleScore: number;
}