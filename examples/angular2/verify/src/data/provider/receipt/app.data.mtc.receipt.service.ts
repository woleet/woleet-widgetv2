import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceiptProviderService {
  private receiptUrl = environment.appEndpoint + '/receipt';

  constructor(private http: HttpClient) {
  }

  getReceiptByAnchorId(anchorId) {
    const params = {};

    return this.http.get(this.receiptUrl + '/' + anchorId, {params: params})
      .toPromise()
      .then(dataSet => {
        return dataSet;
      });
  }
}
