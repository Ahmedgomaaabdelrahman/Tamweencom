import {Component} from '@angular/core';
import {HttpSigninService} from './signinPageservice';
import {NavController, ToastController, LoadingController, AlertController} from 'ionic-angular';
import {homePage}from '../homePage/homePage';
import {Storage} from "@ionic/storage";
import {search} from "../search/search";
import {globalService} from '../Services/globalService';
import {signupPage} from "../signupPage/signupPage";
import {driverhomePage} from "../driverhomePage/driverhomePage";
@Component({
  selector: 'signinPage',
  templateUrl: 'signinPage.html'
})
export class signinPage {
  email: string;
  password: string;
  postuser: string;
  user: any;
  loader: any;
  constructor(public navCtrl: NavController, public globalService: globalService,
              public toastCtrl: ToastController, public storage: Storage,
              private _signin: HttpSigninService, public alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
  }
  forgetPassword() {
    let alert = this.alertCtrl.create({
      title: this.globalService.language == 'en' ? 'Forget Password' : 'استرجاع كلمة المرور',
      inputs: [
        {
          name: 'email',
          placeholder: this.globalService.language == 'en' ? 'E-Mail' : 'البريد الالكترونى'
        }
      ],
      buttons: [
        {
          text: this.globalService.language == 'en' ? 'Cancel' : 'الغاء',
          role: 'cancel',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: this.globalService.language == 'en' ? 'Send' : 'ارسال',
          role: 'cancel',
          handler: data => {
            // console.log(data.email);
            this.doForget(data.email);
          }
        }
      ]
    });
    alert.present();
  }
  doForget(email: string) {
    this._signin.forgotPassword(email)
      .subscribe((data) => {
        console.log(data);
        if (data != null) {
          if (data.error != null) {
            let toast = this.toastCtrl.create({
              message: data.error,
              duration: 4000,
            });
            toast.present();
          } else {
            let toast = this.toastCtrl.create({
              message: this.globalService.language == "en" ? "Password reset successfully, Please check your email." : "تمت اعادة كلمة السر بنجاح برجاء تفقد بريدك الالكترونى",
              duration: 4000,
            });
            toast.present();
          }
        }
      })

  }
  signup() {
    this.navCtrl.push(signupPage);
  }

  login() {
    if (this.email.trim() == '' || this.password.trim() == '') {
      let alert = this.alertCtrl.create({
        title: this.globalService.language == 'en' ? 'Error' : 'خطأ',
        subTitle: this.globalService.language == 'en' ? 'Please enter all fields correctly' : 'برجاء ادخال جميع البيانات بطريقة صحيحة',
        buttons: [this.globalService.language == 'en' ? 'OK' : 'تم']
      });
      alert.present();
    } else {
      let loginLoader = this.loadingCtrl.create({});
      loginLoader.present();
      this._signin.postUser(this.email, this.password)
        .subscribe((data) => {
          console.log(data);
          this.postuser = data;
          if (data != null) {
            if (data.error != null) {
              let toast = this.toastCtrl.create({
                message: data.error,
                duration: 4000,
              });
              toast.present();
            } else {
              this.globalService.setUser(data);
              let foundh = false;
              if (this.globalService.user.usertype == 1) {
                this.navCtrl.push(driverhomePage)
              } else {
                this.navCtrl.getViews().forEach((object, index) => {

                  if (object.component == homePage) {
                    console.log('i found home page poping to it from signin page ? at index: ' + index);
                    foundh = true;
                    this.navCtrl.popTo(index);
                  }

                });
                if (!foundh) {
                  console.log("rooting home  page for the first time");

                  this.navCtrl.setRoot(homePage);
                }

              }
            }
          }
          loginLoader.dismissAll();
        })
    }
  }
  skip() {
    this.navCtrl.setRoot(homePage);
  }
   search() {
    this.navCtrl.push(search);
  }

}
