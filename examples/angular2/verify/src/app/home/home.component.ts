import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '../../environments/environment';
import { SassHelperComponent} from '../components/sass-helper/sass-helper.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(SassHelperComponent) sassHelper: SassHelperComponent;
  private self = this;
  hashes = [];
  files = [];
  isHashed = false;
  fileHasherConfig = environment.widget.configuration.fileHasher;
  proofVerifierConfig = environment.widget.configuration.proofVerifier;

  constructor(private router: Router,
              private route: ActivatedRoute) {
    this.fileHasherConfig.observers['hashCalculated'] = this.hashCalculated;
  }

  ngOnInit() {


    /*,
        observers: {
          hashCalculated: (widgetId, hash) => {this.hashCalculated(widgetId, hash)},
          downloadingFinished: (widgetId, file) => {this.downloadingFinished(widgetId, file)}
        }*/
  }

  hashCalculated(widgetId, hash) {
    console.log('Hashed', widgetId, hash);
  }

  downloadingFinished(widgetId, file) {
    this.files.push({
      widgetId, file
    })
  }
}
