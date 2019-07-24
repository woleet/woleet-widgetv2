import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private self = this;
  hashes = [];
  files = [];
  isHashed = false;

  fileHasherConfig = {
    id: 'my-id-todo',
    lang: 'fr',
    styles: { width: '100%' },
    observers: {
      hashCalculated: (widgetId, hash) => {this.hashCalculated(widgetId, hash)},
      downloadingFinished: (widgetId, file) => {this.downloadingFinished(widgetId, file)}
    }
  };

  proofVerifierConfig = {
    id: 'my-id-todo',
    lang: 'fr',
    verification: {
      server: false
    },
    mode: 'banner',
    styles: {
      zindex: 20,
      icon: {
        width: '32px',
        height: '36px'
      },
      banner: {
        width: '800px'
      }
    },
    receipt: {
      url: 'https://api.woleet.io/v1/receipt/54ceeadc-e2e2-4d37-b76c-432ddf4b3967'
    }
  };

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  hashCalculated(widgetId, hash) {
    this.hashes.push({
      widgetId, hash
    })
  }

  downloadingFinished(widgetId, file) {
    this.files.push({
      widgetId, file
    })
  }
}
