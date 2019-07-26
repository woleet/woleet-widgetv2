import { TestBed, inject } from '@angular/core/testing';

import { AnchorModelService } from './app.data.model.anchor.service';

describe('AnchorModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnchorModelService]
    });
  });

  it('should be created', inject([AnchorModelService], (service: AnchorModelService) => {
    expect(service).toBeTruthy();
  }));
});
