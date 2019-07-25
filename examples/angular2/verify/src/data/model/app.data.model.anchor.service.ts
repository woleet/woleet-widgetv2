import { Injectable } from '@angular/core';
import { AnchorProviderService } from '../provider/app.data.mtc.anchor.service';

@Injectable({
  providedIn: 'root'
})
export class AnchorModelService {
  constructor(private anchorProviderService: AnchorProviderService) {}

  getAnchorIds(hash) {
    return this.anchorProviderService.getAnchorIds(hash);
  }
}
