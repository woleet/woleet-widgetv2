import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnchorProviderService {
  private surveyUrl = environment.apiEndpoint + '/anchor';

  constructor(private http: HttpClient) {
  }

  getAnchorIds(hash) {
    const params = {hash};

    return this.http.get(environment.apiEndpoint + '/anchorids', {params: params})
      .toPromise()
      .then(dataSet => {
        return dataSet;
      });
  }
}
