import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnchorProviderService {
  private anchorUrl = environment.apiEndpoint + '/anchor';

  constructor(private http: HttpClient) {
  }

  getAnchorIds(hash, isSigned) {
    const params: any = { size: 1000 };

    if (isSigned) {
      params.signedHash = hash;
    } else {
      params.hash = hash;
    }

    return this.http.get(environment.apiEndpoint + '/anchorids', {params: params})
      .toPromise()
      .then(dataSet => {
        return dataSet;
      });
  }
}
