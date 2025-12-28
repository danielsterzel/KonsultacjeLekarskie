export interface TimeRange {
    from: string;
    to: string;
}
export interface Availability {
    id?: string;
    doctorId: string;
    type: "cyclic" | "single";
    // cyclic
    fromDate?: string;
    toDate? : string;
    daysOfWeek? : number[];
    timeRanges?: TimeRange[];

    // for single
    date?: string;
}