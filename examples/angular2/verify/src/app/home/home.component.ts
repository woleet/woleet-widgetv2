import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  hashes = [];
  files = [];
  isHashed = false;
  receiptName = null;
  receipt = null;
  fileHasherConfig = environment.widget.configuration.fileHasher;
  proofVerifierConfig = environment.widget.configuration.proofVerifier;

  constructor(private router: Router,
              private route: ActivatedRoute) {
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
        } catch (e) {
          console.log('cant parse the file');
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
    this.hashes.push(hash);
    this.isHashed = this.hashes.length > 0;
  }
}
