import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {globalService} from "../Services/globalService";
import {Platform} from "ionic-angular";
@Injectable()
export class HttpSignUpService {
  private _carsUrl: string = "http://mobile.tamweencom.com/register";
  android = 0;
  ios = 1;
  constructor(private _http: Http, public globalService: globalService, public platform: Platform) {
  }
  postUserRestful(username: string, email: string, password: string, phone: string, image: string): any {
    let body = JSON.stringify({
      "username": username, "email": email, "password": password, "phone": phone,
      "image": image, "gcm_regid": this.globalService.deviceToken,
      "device": this.platform.platforms()[1] == 'android' ? this.android : this.ios
    });
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});

    return this._http.post(this._carsUrl, body, options)
      .map(res => res.json());
  }


}
