export interface Frame {
    id: number;
    rolls: any[];
    score: number;
    isActive: boolean;
}

export interface Score {
    frames: Frame[];
    totalScore: number;
}