import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {globalService} from "../Services/globalService";
import { CacheService } from "ionic-cache";
@Injectable()
export class HttpCategoryService {
  public _carsUrl: string = "http://mobile.tamweencom.com/categories";
  public _carsUrl_en: string = "http://mobile.tamweencom.com/en/categories";
  constructor(private cache: CacheService,public _http: Http, public globalServices:globalService) {
  }
  getCategoryRestful(): any {

    if(this.globalServices.language == "en"){
       let url = this._carsUrl_en;
       let request = this._http.get(url).map((res) => res.json());
       return this.cache.loadFromObservable(url,request);
    }
    else {
       let url = this._carsUrl;
       let request = this._http.get(url).map((res) => res.json());
       return this.cache.loadFromObservable(url,request);
    }
  }
}
