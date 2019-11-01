import {Component, NgZone, OnInit} from '@angular/core';
import * as evrythng from 'evrythng';
import ScanThng from 'scanthng/src/index'

// const APPLICATION_API_KEY = 'OFRS90So0W5xROeSAPrt2JG1HdPxVii8oYXCnLiHs1eGNFC0lWntEU9t4Tiv81GgH8Q1b2v0u7AU47ZD';
const APPLICATION_API_KEY = 'VAujQcbk5xksz33xA38qadH2wiEskyPbP9l199AhLfpoGKTD3B0918nHlAQQ1Ui5sWvJLo9xW36vz6jG';

global['evrythng'] = evrythng;

evrythng.setup({apiUrl: 'https://api.evrythng.com'});
evrythng.use(ScanThng);
const app = new evrythng.Application(APPLICATION_API_KEY);


const createFilter = () => {
  const map = {
    qr: {method: '2d', type: 'qr_code'},
    ir: {method: 'ir', type: 'image'},
    other: {method: 'auto', type: 'auto'},
  };
  return map['qr'];
};


@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.component.html',
  styleUrls: ['./qr-scan.component.scss']
})
export class QrScanComponent implements OnInit {

  public result = 'No Result yet'

  constructor(private _ngZone: NgZone) {
  }

  ngOnInit() {
  }

  public startCamera() {

    // this._ngZone.runOutsideAngular(() => {
      app.scanStream({
        filter: createFilter(),
        containerId: 'stream_container',
      })
        .then((res) => {
          console.log(res);
          if (!res.length) {
            console.log('No results');
            return;
          }

          this.result = res;

          // Raw URL
          const url = (res.length && res[0].results.length)
            ? res[0].results[0].redirections[0]
            : res[0].meta.value;

          console.log(url);

          window.location = url;
        })
        .catch(console.log);
    // })

  }

}
