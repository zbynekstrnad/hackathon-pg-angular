import {Component, NgZone} from '@angular/core';
import * as evrythng from 'evrythng';
import ScanThng from 'scanthng/src/index'

const APPLICATION_API_KEY = 'OFRS90So0W5xROeSAPrt2JG1HdPxVii8oYXCnLiHs1eGNFC0lWntEU9t4Tiv81GgH8Q1b2v0u7AU47ZD';


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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private _ngZone: NgZone) {

  }

  public startCamera() {

    this._ngZone.runOutsideAngular(() => {
      app.scanStream({
        filter: createFilter(),
        containerId: 'stream_container',
      })
        .then((res) => {
          if (!res.length) {
            console.log('No results');
            return;
          }

          console.log(res);

          // Raw URL
          const url = (res.length && res[0].results.length)
            ? res[0].results[0].redirections[0]
            : res[0].meta.value;
        })
        .catch(console.log);
    })

  }
}
