import { TestBed, inject } from '@angular/core/testing';
import { ReceiptProviderService } from './app.data.mtc.receipt.service';

describe('ReceiptProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReceiptProviderService]
    });
  });

  it('should be created', inject([ReceiptProviderService], (service: ReceiptProviderService) => {
    expect(service).toBeTruthy();
  }));
});
