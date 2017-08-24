import {Component} from '@angular/core';
import {NavController, ToastController, AlertController, LoadingController} from 'ionic-angular';
import {globalService} from '../Services/globalService';
import {homePage} from '../homePage/homePage';
import {Storage} from '@ionic/storage';
import {Camera} from "ionic-native";
@Component({
  selector: 'editProfile',
  templateUrl: 'editProfile.html'
})
export class editProfile {
  userInfo: any;
  res: any;
  public user: any;
  postMyUserToServer: string;
  username: string;
  email: string;
  password: string;
  postuser: string;
  phone: any;
  userid: any;
  public base64Image: string = "";
  public base64: string = "";

  constructor(public storage: Storage,
              public globalService: globalService, public navCtrl: NavController,
              public toastCtrl: ToastController, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    this.user = this.globalService.user;
  }
  showErrorAlert() {
    let alert = this.alertCtrl.create({
      title: this.globalService.language == 'en' ? 'Error' : 'خطأ',
      subTitle: this.globalService.language == 'en' ? 'Please enter all fields correctly' : 'برجاء ادخال جميع البيانات بطريقة صحيحة',
      buttons: [this.globalService.language == 'en' ? 'OK' : 'تم']
    });
    alert.present();
  }
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
    //noinspection TypeScriptUnresolvedVariable
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
    //noinspection TypeScriptUnresolvedVariable
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
  editProfileInfo() {
    if (this.user.username.trim() == '' || this.user.phone.trim() == '' || this.user.password.trim() == '' ||
      this.user.email.trim() == '') {
      this.showErrorAlert();
    } else {
      this.email = this.user.email;
      this.password = this.user.password;
      this.username = this.user.username;
      // console.log(this.username);
      this.phone = this.user.phone;
      let loginLoader = this.loadingCtrl.create({});
      loginLoader.present();
      this.globalService.editProfileInfo(this.username, this.email, this.password, this.phone,
        this.base64 == "" ? "" : this.base64)
        .subscribe((data) => {
          loginLoader.dismissAll();
          this.postuser = data;
          console.log(data);
          let str = data.error;
          if (data != null) {
            if (data.error != null) {
              let toast = this.toastCtrl.create({
                message: str,
                duration: 4000,
              });
              toast.present();
            }
            else {
              this.globalService.setUser(data);
              let foundh = false;
              let toast = this.toastCtrl.create({
                message: this.globalService.language == 'en' ? 'User data updated successfully!' : 'تم تعديل البيانات بنجاح',
                duration: 4000,
              });
              toast.present();
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
                this.navCtrl.push(homePage);
              }
            }
          }
        }, (error) => {
          loginLoader.dismissAll();
          let toast = this.toastCtrl.create({
            message: error,
            duration: 4000,
          });
          toast.present();
          console.log(error);
        });
    }
  }


}
