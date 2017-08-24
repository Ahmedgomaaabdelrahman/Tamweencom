import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {globalService} from "../Services/globalService";
// import 'rxjs/add/operator/map';
@Injectable()
export class bestofferssService {
    private _carsUrl:string = "http://mobile.tamweencom.com/bestoffers";
    private _carsUrl_en:string = "http://mobile.tamweencom.com/en/bestoffers";
    constructor(private _http: Http, public globalService:globalService){ }

    getbestoffers(): any{
      return this._http.get(this.globalService.language == 'en' ? this._carsUrl_en: this._carsUrl).map(res => res.json());
    }

}
