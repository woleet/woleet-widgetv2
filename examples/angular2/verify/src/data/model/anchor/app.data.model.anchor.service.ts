import { Injectable } from '@angular/core';
import { AnchorProviderService } from '../../provider/anchor/app.data.mtc.anchor.service';

@Injectable({
  providedIn: 'root'
})
export class AnchorModelService {
  constructor(private anchorProviderService: AnchorProviderService) {}

  getAnchorIds(hash, isSigned = false): any {
    return this.anchorProviderService.getAnchorIds(hash, isSigned);
  }
}
