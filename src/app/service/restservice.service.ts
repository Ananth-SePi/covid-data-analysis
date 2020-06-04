import { StateWiseTestDataModelWrapper } from '../model/statewisedatamodel';

export class RESTService {

    async getStateWiseTestJSON(): Promise<StateWiseTestDataModelWrapper> {
    const response = await fetch('https://api.covid19india.org/state_test_data.json');
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

}
