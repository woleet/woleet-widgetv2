import { Injectable } from '@angular/core';
import { ReceiptProviderService } from '../../provider/receipt/app.data.mtc.receipt.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptModelService {
  constructor(private receiptProviderService: ReceiptProviderService) {}

  getReceiptByAnchorId(anchorId) {
    return this.receiptProviderService.getReceiptByAnchorId(anchorId);
  }
}
