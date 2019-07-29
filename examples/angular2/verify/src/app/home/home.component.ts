import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '../../environments/environment';
import { SassHelperComponent } from '../components/sass-helper/sass-helper.component';
import { AnchorModelService } from '../../data/model/anchor/app.data.model.anchor.service';
import { ReceiptModelService } from '../../data/model/receipt/app.data.model.receipt.service';
import { ObjectService } from '../services/object/object.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(SassHelperComponent) sassHelper: SassHelperComponent;
  hashes = [];
  payloads = [];
  proofVerifierConfigs = [];
  isHashed = false;
  receiptName = null;
  receipt = null;
  fileHasherConfig = environment.widget.configuration.fileHasher;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private receiptModelService: ReceiptModelService,
              private anchorModelService: AnchorModelService) {
    this.fileHasherConfig.observers['hashCalculated'] = (widgetId, hash) => { this.hashCalculated(widgetId, hash) }
  }

  ngOnInit() {
  }

  onFileChange(e) {
    let reader = new FileReader();
    let self = this;

    if(e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      this.receiptName = file.name;

      reader.readAsText(file);
      reader.onload = () => {
        try {
          self.receipt = JSON.parse(reader.result.toString());

          if (self.receipt) {
            let proofVerifierConfig = self.buildProofVerifierConfig(self.receipt);

            this.proofVerifierConfigs = [];
            this.proofVerifierConfigs.push(proofVerifierConfig);
          }
        } catch (e) {
        }
      };
    }
  }

  highlightDragZone(e) {
    e.target.parentElement.classList.add('highlight');
  }

  unHighlightDragZone(e) {
    e.target.parentElement.classList.remove('highlight')
  }

  hashCalculated(widgetId, hash) {
    const self = this;

    this.hashes.push(hash);
    this.isHashed = this.hashes.length > 0;

    if (hash) {
      Promise.all([
        self.anchorModelService.getAnchorIds(hash),
        self.anchorModelService.getAnchorIds(hash, true)
      ]).then(values => {
        const anchorsIds = [].concat(values[0].content, values[1].content);
        const promises = [];

        anchorsIds.forEach((anchorId) => {
          promises.push(self.receiptModelService.getReceiptByAnchorId(anchorId));
        });

        Promise.all(promises)
            .then((receipts) => {
              self.payloads = receipts;
              self.buildProofVerifierConfigs();
            });
      });
    }
  }

  buildProofVerifierConfigs() {
    const self = this;
    this.proofVerifierConfigs = [];

    this.payloads.forEach((payload) => {
      const proofVerifierConfig = self.buildProofVerifierConfig(payload);
      // It's used 'unshift' instead of 'push' because the configuration with the highest zindex should be first in the list
      this.proofVerifierConfigs.unshift(proofVerifierConfig)
    });
  }

  removeReceipt() {
    this.receipt = null;
    this.receiptName = null;
    this.buildProofVerifierConfigs();
  }

  buildProofVerifierConfig(payload: any): any {
    let proofVerifierConfig = ObjectService.copy(environment.widget.configuration.proofVerifier);

    proofVerifierConfig.receipt.payload = payload;
    proofVerifierConfig.styles.zindex = proofVerifierConfig.styles.zindex + this.proofVerifierConfigs.length * 2;

    return proofVerifierConfig;
  }
}
