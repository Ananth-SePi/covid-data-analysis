export interface StateWiseCasesDataModelWrapper {
    cases_time_series: any;
    statewise: StateWiseCasesDataModel[];
    tested: any;
}

export interface StateWiseCasesDataModel {
    active: string;
    confirmed: string;
    deaths: string;
    deltaconfirmed: string;
    deltadeaths: string;
    deltarecovered: string;
    lastupdatedtime: string;
    migratedother: string;
    recovered: string;
    state: string;
    statecode: string;
    statenotes: string;
}

export interface StateWiseTestDataModelWrapper {
    states_tested_data: StateWiseTestDataModel[];
}

export interface StateWiseTestDataModel {
    coronaenquirycalls: string;
    cumulativepeopleinquarantine: string;
    negative: string;
    numcallsstatehelpline: string;
    numicubeds: string;
    numisolationbeds: string;
    numventilators: string;
    populationncp2019projection: string;
    positive: string;
    source1: string;
    source2: string;
    state: string;
    tagpeopleinquarantine: string;
    tagtotaltested: string;
    testpositivityrate: string;
    testspermillion: string;
    testsperpositivecase: string;
    testsperthousand: string;
    totaln95masks: string;
    totalpeoplecurrentlyinquarantine: string;
    totalpeoplereleasedfromquarantine: string;
    totalppe: string;
    totaltested: string;
    unconfirmed: string;
    updatedon: string;
}
