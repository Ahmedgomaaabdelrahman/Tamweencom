import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
// import 'rxjs/add/operator/map';

@Injectable()
export class singleService {
  public productID: string;

  private _carsUrl: string = "http://mobile.tamweencom.com/productsofcategory/";

  constructor(private _http: Http) {
  }
  getProduct(): any {
    return this._http.get(this._carsUrl + this.productID)
      .map(this.todaysOrderData)
  }
  todaysOrderData(res: any) {
    let body = res.json();
    return body;
  }
}
