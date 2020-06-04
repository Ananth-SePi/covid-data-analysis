export interface AnalysisDateModel {
    state: string;
    totalConfirmedCases: number;
    totalActiveCases: number;
    totalRecoveredCases: number;
    totalDeceasedCases: number;
    population2019Projection: number;
    totalTestTaken: number;
    testPerMillion: number;
    testPerThousand: number;
}
