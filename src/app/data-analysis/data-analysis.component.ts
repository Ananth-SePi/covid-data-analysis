import { Component, OnInit, ViewChild } from '@angular/core';
import { StateWiseTestDataModel,
  StateWiseTestDataModelWrapper,
  StateWiseCasesDataModelWrapper,
  StateWiseCasesDataModel } from '../model/statewisedatamodel';
import { AnalysisDateModel } from '../model/analysisdatemodel';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.scss']
})
export class DataAnalysisComponent implements OnInit {

  analysisDataList: AnalysisDateModel[] = [];
  statewiseTestDataList: StateWiseTestDataModel[] = [];
  filteredStatewiseTestDataList: StateWiseTestDataModel[] = [];
  filteredStatewiseCasesDataList: StateWiseCasesDataModel[] = [];

  dataSource;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns = ['index', 'state', 'confirmed', 'active', 'recovered', 'deaths',
  'totaltested', 'recoveryrate', 'deathrate'];

  uniqueStates = new Map<string, string>();

  constructor(public datePipe: DatePipe) { }

  ngOnInit() {
    this.initAnalysisData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async initAnalysisData() {
    const statewiseCasesData: StateWiseCasesDataModelWrapper = await this.getStateWiseDataJSON();
    this.filteredStatewiseCasesDataList = statewiseCasesData.statewise;
    const statewiseTestData: StateWiseTestDataModelWrapper = await this.getStateWiseTestJSON();
    this.statewiseTestDataList = statewiseTestData.states_tested_data;
    this.filterStatewiseTestData();
  }

  filterStatewiseTestData() {
    if (this.statewiseTestDataList.length > 0) {
      let prevState = this.statewiseTestDataList[0].state;
      this.statewiseTestDataList.sort((a, b) => {
          if (a.state === b.state) {
            return Number(a.totaltested) - Number(b.totaltested);
          }
          return a.state > b.state ? 1 : -1;
      });
      this.statewiseTestDataList.forEach((testData, index) => {
        if (!testData.state.includes(prevState)) {
          this.filteredStatewiseTestDataList.push(this.statewiseTestDataList[index - 1]);
        }
        prevState = testData.state;
      });
      this.filteredStatewiseTestDataList.push(this.statewiseTestDataList[this.statewiseTestDataList.length - 1]);
    }
    this.filteredStatewiseTestDataList.forEach((stateTestData) => {
      const stateCaseData: StateWiseCasesDataModel = this.filteredStatewiseCasesDataList
      .filter(caseData => caseData.state === stateTestData.state)[0];
      this.analysisDataList.push({
        state: stateTestData.state,
        statenotes: stateCaseData.statenotes,
        confirmed: Number(stateCaseData.confirmed),
        active: Number(stateCaseData.active),
        recovered: Number(stateCaseData.recovered),
        deaths: Number(stateCaseData.deaths),
        totaltested: !stateTestData.totaltested ? null : Number(stateTestData.totaltested),
        testspermillion: !stateTestData.testspermillion ? null : Number(stateTestData.testspermillion),
        testsperthousand: !stateTestData.testsperthousand ? null : Number(stateTestData.testsperthousand),
        testsperpositivecase: !stateTestData.testsperpositivecase ? null : Number(stateTestData.testsperpositivecase),
        updatedon: stateTestData.updatedon,
        recoveryrate: Number(((Number(stateCaseData.recovered) / Number(stateCaseData.confirmed)) * 100).toFixed(2)),
        deathrate: Number(((Number(stateCaseData.deaths) / Number(stateCaseData.confirmed)) * 100).toFixed(2))
      });
    });
    this.dataSource = new MatTableDataSource(this.analysisDataList);
    this.dataSource.sort = this.sort;
  }

  // To get the state wise covid-19 test data.
  async getStateWiseTestJSON(): Promise<StateWiseTestDataModelWrapper> {
    const response = await fetch('https://api.covid19india.org/state_test_data.json');
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  // To get the state wise covid-19 cases data.
  async getStateWiseDataJSON(): Promise<StateWiseCasesDataModelWrapper> {
    const response = await fetch('https://api.covid19india.org/data.json');
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  openProjectGithub() {
    window.open('https://github.com/Ananth-SePi/covid-data-analysis', '_blank');
  }

}
