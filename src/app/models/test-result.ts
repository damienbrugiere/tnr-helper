export interface TestResult {
    id?: number;
    scenarioId: string;
    scenarioName: string;
    errorMessage: string;
    uri: string;
    flaky: boolean;
    gitlabIssueId?: number;
    gitlabProjectId?: string;
    video?:string;
    expected?: string;
    result?: string;
    date: Date
    campaignId: number
}