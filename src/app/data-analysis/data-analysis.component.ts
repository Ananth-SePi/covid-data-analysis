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
  'totaltested', 'recoveryratio', 'deathratio'];

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
    const currentDate = new Date();
    const currentDateString = this.datePipe.transform(currentDate.toLocaleDateString(), 'dd/MM/yyyy');
    currentDate.setDate(currentDate.getDate() - 1);
    const prevDateString = this.datePipe.transform(currentDate.toLocaleDateString(), 'dd/MM/yyyy');
    this.statewiseTestDataList.forEach(testData => {
      if (testData.totaltested && testData.updatedon === currentDateString && !this.uniqueStates.has(testData.state)) {
        this.filteredStatewiseTestDataList.push(testData);
        this.uniqueStates.set(testData.state, testData.state);
      } else if (testData.totaltested && testData.updatedon === prevDateString && !this.uniqueStates.has(testData.state)) {
        this.filteredStatewiseTestDataList.push(testData);
        this.uniqueStates.set(testData.state, testData.state);
      }
    });
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
        recoveryratio: Number(((Number(stateCaseData.recovered) / Number(stateCaseData.confirmed)) * 100).toFixed(2)),
        deathratio: Number(((Number(stateCaseData.deaths) / Number(stateCaseData.confirmed)) * 100).toFixed(2))
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
