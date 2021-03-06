export interface AnalysisDateModel {
    active: number;
    confirmed: number;
    deaths: number;
    recovered: number;
    state: string;
    statenotes: string;
    testspermillion: number;
    testsperpositivecase: number;
    testsperthousand: number;
    totaltested: number;
    updatedon: string;
    recoveryrate: number;
    deathrate: number;

    populationncp2019projection?: number;
    deltaconfirmed?: string;
    deltadeaths?: string;
    deltarecovered?: string;
    lastupdatedtime?: string;
    migratedother?: string;
    statecode?: string;
    coronaenquirycalls?: string;
    cumulativepeopleinquarantine?: string;
    negative?: string;
    numcallsstatehelpline?: string;
    numicubeds?: string;
    numisolationbeds?: string;
    numventilators?: string;
    positive?: string;
    source1?: string;
    source2?: string;
    tagpeopleinquarantine?: string;
    tagtotaltested?: string;
    testpositivityrate?: string;
    totaln95masks?: string;
    totalpeoplecurrentlyinquarantine?: string;
    totalpeoplereleasedfromquarantine?: string;
    totalppe?: string;
    unconfirmed?: string;
}
