export interface Campaign {
    id?: number;
    name: string,
    date: Date,
    successCount?: number;
    failedCount?: number;
    totalCount?:number;
}