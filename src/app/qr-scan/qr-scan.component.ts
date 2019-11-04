import {Component, NgZone, OnInit} from '@angular/core';
import * as evrythng from 'evrythng';
import ScanThng from 'scanthng/src/index'
import {catchError} from "rxjs/operators";

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


  public proven;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Create a new anonymous Application User and save the credentials in localStorage.
   *
   * @param {object} app - The App scope.
   * @returns {object} The created anonymous Application User.
   * @method _createNewAnonUser
   * @async
   */
  private _createNewAnonUser = async (app) => {
    let appUser = await app.appUser().create({anonymous: true});
    await appUser.init();

    const newAppUser = await evrythng.api({
      url: `/users/${appUser.id}`,
      apiKey: appUser.apiKey,
      method: 'put',
      data: {
        customFields: {
          proven: true //Date.now() % 2 === 0
        }
      }
    });

    localStorage.setItem('UserId', appUser.id);
    localStorage.setItem('UserKey', appUser.apiKey);
    return new evrythng.User(appUser.apiKey);
  };

  /**
   * Get an anonymous Application User to use in the app.
   *
   * @method getAnonUser
   * @param {object} app - The App scope.
   * @returns {object} The created anonymous Application User.
   * @async
   */
  private async getAnonUser(app) {
    const id = localStorage.getItem('UserId');
    const apiKey = localStorage.getItem('UserKey');
    if (!id || !apiKey) {
      // Create a new one
      console.log('new user')
      return this._createNewAnonUser(app);
    }
    // Load existing user (problems changing project...)
    try {
      const appUser = new evrythng.User(apiKey);
      await appUser.init();

      return appUser;
    } catch (e) {
      console.log(e);
      console.log('Anon user invalid, creating another');
      return this._createNewAnonUser(app);
    }
  };

  /**
   * @method _getUrlFromStreamResult
   * @param res
   * @private
   */
  private _getUrlFromStreamResult(res) {
    const url = (res.length && res[0].results.length)
      ? res[0].results[0].redirections[0]
      : res[0].meta.value;

    return url;
  }

  /**
   * Method validates scanStreamRes
   * @method _validScanResult
   * @param res
   * @private
   */
  private _validScanResult(res) {
    return (res.length && res[0].results.length > 0)
  }

  /**
   * Check if thng contains MultipleScans tag
   * @method _checkMultipleScans
   * @param res
   * @private
   */
  private _checkMultipleScans(thngResp) {
    const {tags = []} = thngResp;
    return tags.includes('MultipleScans')
  }

  /**
   * @method startCamera
   * @public
   * @async
   */
  public async startCamera() {
    try {
      const scanStreamRes = await app.scanStream({
        filter: createFilter(),
        containerId: 'stream_container',
      });



      if (!this._validScanResult(scanStreamRes)) {
        alert('QR code has not been recognized!');
        return;
      } else {
        console.info('Thng Id:', scanStreamRes[0].results[0].thng.id)
      }

      // extract URL from rersult
      const url = this._getUrlFromStreamResult(scanStreamRes);

      // return existing user or create a new one
      const appUser = await this.getAnonUser(app);

      const thngResp  = await appUser.thng(scanStreamRes[0].results[0].thng.id).read();

      if (this._checkMultipleScans(thngResp)) {
        alert('QR code has been already used!');
        return;
      }

      // trigger a new event
      await appUser.action('scans').create({type: 'scans', thng: scanStreamRes[0].results[0].thng.id})
      const respList = await appUser.action('scans').setFilter(`timestamp>${Date.now() - 300000}`).read()

      const numOfItems = respList.length;
      const userIsProven = appUser.customFields.proven;

      console.log('numOfItems: ', numOfItems)
      this.proven = userIsProven;

      if (numOfItems < 6 && userIsProven === true) {
        this._redirect(url);
      } else if (userIsProven === false && numOfItems < 2) {
        this._redirect(url);
      } else {
        alert(`User ${userIsProven ? 'is' : 'is not'} proven but already scanned ${numOfItems} times`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  private _redirect(url) {
    console.log('redirect!');
   // window.location = url;
  }
}
