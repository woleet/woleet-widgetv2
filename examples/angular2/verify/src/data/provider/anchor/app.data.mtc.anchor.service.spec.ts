import { TestBed, inject } from '@angular/core/testing';
import { AnchorProviderService } from './app.data.mtc.anchor.service';

describe('AnchorProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnchorProviderService]
    });
  });

  it('should be created', inject([AnchorProviderService], (service: AnchorProviderService) => {
    expect(service).toBeTruthy();
  }));
});
