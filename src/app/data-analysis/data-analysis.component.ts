import { Component, OnInit } from '@angular/core';
import { StateWiseTestDataModel,
  StateWiseTestDataModelWrapper,
  StateWiseCasesDataModelWrapper,
  StateWiseCasesDataModel } from '../model/statewisedatamodel';
import { AnalysisDateModel } from '../model/analysisdatemodel';

@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.scss']
})
export class DataAnalysisComponent implements OnInit {

  analysisDataList: AnalysisDateModel[];
  statewiseTestDataList: StateWiseTestDataModel[];
  filteredStatewiseTestDataList: StateWiseTestDataModel[];
  filteredStatewiseCasesDataList: StateWiseCasesDataModel[];

  constructor() { }

  ngOnInit() {
    this.initAnalysisData();
  }

  async initAnalysisData() {
    const statewiseCasesData: StateWiseCasesDataModelWrapper = await this.getStateWiseDataJSON();
    this.filteredStatewiseCasesDataList = statewiseCasesData.statewise;
    const statewiseTestData: StateWiseTestDataModelWrapper = await this.getStateWiseTestJSON();
    this.statewiseTestDataList = statewiseTestData.states_tested_data;
    this.filterStatewiseTestData();
  }

  filterStatewiseTestData() {
    this.filteredStatewiseTestDataList = this.statewiseTestDataList
    .filter(value => value.updatedon === '02/06/2020');
  }

  async getStateWiseTestJSON(): Promise<StateWiseTestDataModelWrapper> {
    const response = await fetch('https://api.covid19india.org/state_test_data.json');
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  async getStateWiseDataJSON(): Promise<StateWiseCasesDataModelWrapper> {
    const response = await fetch('https://api.covid19india.org/data.json');
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

}
