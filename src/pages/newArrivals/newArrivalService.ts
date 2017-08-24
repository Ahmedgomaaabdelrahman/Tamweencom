import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {globalService} from "../Services/globalService";
// import 'rxjs/add/operator/map';
@Injectable()
export class newArrivalsService {
    private newproductsAR:string = "http://mobile.tamweencom.com/newproducts/";
    private newproductsEN:string = "http://mobile.tamweencom.com/en/newproducts/";
    constructor(private _http: Http, public globalService:globalService){ }

    getnewArrivals():any{
      return this._http.get(this.globalService.language == 'en' ?
      this.newproductsEN : this.newproductsAR
      ).map(res => res.json());
    }
}
