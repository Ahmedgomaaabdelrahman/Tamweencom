import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Storage} from '@ionic/storage';
import {globalService} from "../Services/globalService";
import {Platform} from "ionic-angular";
@Injectable()
export class HttpSigninService {
  public user: any;
  private _carsUrl: string = "http://mobile.tamweencom.com/login";
  private forgetPassword_URL: string = "http://mobile.tamweencom.com/forgetpassword";
  android = 0;
  ios = 1;
  constructor(private _http: Http, public storage: Storage, public globalService: globalService, public platform: Platform) {
    // console.log("Sdasdsadsa");
    this.storage.get("USERKey").then(function (res) {
      this.user = res;
      // console.log(res);
    });
  }
  forgotPassword(email: string): any {

    let body = JSON.stringify({'email': email});
    console.log(body);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.forgetPassword_URL, body, options)
      .map(res => res.json());
  }
  postUser(email: string, password: string): any {

    let body = JSON.stringify({
      "email": email, "password": password,
      "gcm_regid": this.globalService.deviceToken,
      "device": this.platform.platforms()[1] == 'android' ? this.android : this.ios
    });
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});

    return this._http.post(this._carsUrl, body, options)
      .map(res => res.json());
  }

}
