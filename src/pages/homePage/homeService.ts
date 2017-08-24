import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
// import 'rxjs/add/operator/map';
@Injectable()
export class HttpHomeService {
    private _carsUrl:string = "http://mobile.tamweencom.com/en/slider";
    constructor(private _http: Http){ }

    gethomeSlider():any{
        return this._http.get(this._carsUrl).map(res => res.json());
    }

}
