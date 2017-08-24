import {Component} from '@angular/core';
import {NavController, ToastController, Platform, AlertController} from 'ionic-angular';
import {HttpSignUpService} from './signUpService';
import {globalService} from '../Services/globalService';
import {homePage} from '../homePage/homePage';
import {Camera} from "ionic-native";
import {search} from "../search/search";
@Component({
  selector: 'signupPage',
  templateUrl: 'signupPage.html'
})
export class signupPage {
  postMyUserToServer: string;
  username: string = "";
  email: string = "";
  password: string = "";
  postuser: string = "";
  phone: any;

  constructor(private _httpUserService: HttpSignUpService, public navCtrl: NavController,
              public toastCtrl: ToastController, public globalService: globalService, public platform: Platform,
              public alertCtrl: AlertController) {

  }
  public base64Image: string = "";
  public base64: string = "";
  GalleryOrCamera() {
    let confirm = this.alertCtrl.create({
      title: this.globalService.language == 'en' ? 'Choose method' : 'اختر الطريقة',
      message: this.globalService.language == 'en' ? 'Choose picture from gallery or camera ?' : 'أختر اذا كنت تريد رفع الصورة عن طريق الكاميرا ام من صور الهاتف',
      buttons: [
        {
          text: this.globalService.language == 'en' ? 'Gallery' : 'الصور', //TODO get translation
          handler: () => {
            this.pickPicture();
          }
        },
        {
          text: this.globalService.language == 'en' ? 'Camera' : 'الكاميرا',
          handler: () => {
            this.takePicture();
          }
        }
      ]
    });
    confirm.present();
  }
  pickPicture() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64 = imageData;
      console.log(this.base64);
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  takePicture() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64 = imageData;
      console.log(this.base64);
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }
  postDataToServer() {
    this._httpUserService.postUserRestful(this.username, this.email, this.password, this.phone, this.base64)
      .subscribe((data) => {
        console.log(data);
        let str = data.error;
        // console.log(str);
        if (data != null) {
          if (data.error != null) {
            let toast = this.toastCtrl.create({
              message: str,
              duration: 4000,
            });
            toast.present();
          }
          else {
            // console.log(data)
            this.globalService.setUser(data);
            this.globalService.loggedIn = true;
            let foundh = false;
            this.navCtrl.getViews().forEach((object, index) => {
              if (object.component == homePage) {
                console.log('i found home page poping to it ? at index: ' + index);
                console.log(this.navCtrl.getViews()[index]);
                foundh = true;
                this.navCtrl.popTo(index);
              }
            });
            if (!foundh) {
              console.log("pushing home page for the first time");
              this.navCtrl.setRoot(homePage);
            }
          }
        }
      })
  }
 search() {
    this.navCtrl.push(search);
  }

}
