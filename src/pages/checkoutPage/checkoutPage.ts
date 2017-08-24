import {Component,ElementRef} from '@angular/core';
import {NavController, LoadingController, AlertController, ToastController, PopoverController} from 'ionic-angular';
import {globalService} from "../Services/globalService";
import {AboutPage} from "../about/about";
import {homePage} from '../homePage/homePage';
import {Observable} from "rxjs";
import {Geolocation,PayPal, PayPalPayment, PayPalConfiguration} from "ionic-native";
import {PopoverPage} from "../popover/popover";
import {signinPage} from "../signinPage/signinPage";
@Component({
  selector: 'checkoutPage',
  templateUrl: 'checkoutPage.html'
})
export class checkoutPage {
  comment: string = "";
  zip: string = "";
  address: string = "";
  city: string = "";
  moneyTotal: number = 0;
  lat: number = 0;
  lng: number = 0;
  payment = "cod";
  constructor(public navCtrl: NavController, public globalService: globalService, public alertCtrl: AlertController
    , public loadingCtrl: LoadingController, public toastCtrl: ToastController, public popoverCtrl: PopoverController,private elementRef:ElementRef) {
    this.moneyTotal = this.globalService.moneyTotal;
  }
  paypal(){
    PayPal.init({
      "PayPalEnvironmentProduction": "AcZ4r2M17i3I2wgkk1uvfD88LkNx4Tw46clDUoAEbOF3FOuvu71L7ISDv9R0PUv555q0zI82Ai2aWxA_",
      "PayPalEnvironmentSandbox": "AdIIcSOoakHgdQ7yyX5CXwPz8qSfOA1gXOBPZ2ALi3r-9GQ-qhbFGd09CQStquhACq6UzM_wu_pfHoQo"
    }).then(() => {
      PayPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
      })).then(() => {
        let payment = new PayPalPayment('0.01', 'USD', 'Description', 'sale');
        PayPal.renderSinglePaymentUI(payment).then(() => {
          let toast = this.toastCtrl.create({
            message: "payed success",
            duration: 4000,
          });
          toast.present();
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        console.log("payment failed configuration ");
        let toast = this.toastCtrl.create({
          message: "payment failed configuration",
          duration: 4000,
        });
        toast.present();
        // Error in configuration
      });
    }, () => {
      console.log("payment failed PayPal isn't supported ");
      let toast = this.toastCtrl.create({
        message: "payment failed PayPal isn't supported",
        duration: 4000,
      });
      toast.present();
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  }





















  submitOrder() {
    if (this.address.trim() == '') {
      this.showAlert();
    } else {
      this.showConfirmation();
    }

  }

  ionViewDidLoad() {
    this.getCurrentLocation().subscribe(location => {
      console.log(location);
      this.geoCodeIT(location);
    });
  }

  geocoder = new google.maps.Geocoder();

  geoCodeIT(latlng) {
    this.geocoder.geocode({'location': latlng}, (results, status) => {
      console.log(status);
      console.log(results);
      let isitok: string;
      if (typeof status === "string") {
        isitok = status;
      }
      if (isitok == "OK") {
        if (results[0]) {
          let destination = '';
          destination = results[0].formatted_address;
          this.address = destination;
          console.log(destination);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  // sudo ionic plugin add cordova-plugin-geolocation

  getCurrentLocation() {
    let options = {timeout: 10000, enableHighAccuracy: true};
    let loading = this.loadingCtrl.create({
      content: 'Locating...'
    });
    loading.present();
    let locationObs = Observable.create(observable => {
      Geolocation.getCurrentPosition(options).then(resp => {
          let lat = resp.coords.latitude;
          let lng = resp.coords.longitude;
          this.lat = resp.coords.latitude;
          this.lng = resp.coords.longitude;
          let location = new google.maps.LatLng(lat, lng);

          observable.next(location);
          loading.dismiss();
        }, (err) => {
          console.log('Gelocation err: ' + err);
          loading.dismiss();
        }
      )
    });
    return locationObs;
  }

  ionViewDidEnter() {
    if (this.globalService.myAddress != "") {
      this.address = this.globalService.myAddress;
      this.lat = this.globalService.myLat;
      this.lng = this.globalService.myLng;
      console.log("ionview did enter and i changed address to: " + this.address + " " + this.lat + " " + this.lng);
      this.globalService.myAddress = "";
      this.globalService.myLat = 0;
      this.globalService.myLng = 0;
    }
  }

  showMap() {
    this.navCtrl.push(AboutPage);
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: this.globalService.language == 'en' ? 'Error' : 'خطأ',
      subTitle: this.globalService.language == 'en' ? 'Please enter all fields correctly' : 'برجاء ادخال جميع البيانات بطريقة صحيحة',
      buttons: [this.globalService.language == 'en' ? 'OK' : 'تم']
    });
    alert.present();
  }

  showConfirmation() {
    let alert = this.alertCtrl.create({
      title: this.globalService.language == 'en' ? 'Confirmation' : 'تأكيد',
      subTitle: this.globalService.language == 'en' ? 'Are you sure you want to order ?!' : 'هل تريد حقاً تأكيد الطلب ؟!',
      buttons: [{

        text: this.globalService.language == 'en' ? 'No' : 'لا',
        handler: () => {
        }
      }, {
        text: this.globalService.language == 'en' ? 'Yes' : 'نعم',
        handler: () => {
          this.postOrder();
          //add action to no
        }
      }]
    });
    alert.present();
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ev: event});
    popover.onDidDismiss(page => {
      if (page != null) {
        // if (this.globalService.loggedIn) {
        if (page.title == 'Logout') {
          this.globalService.logout();
          this.navCtrl.push(signinPage);
          let alert = this.alertCtrl.create({
            title: this.globalService.language == 'en' ? 'Logged out' : 'تسجيل الخروج',
            subTitle: this.globalService.language == 'en' ? 'Logged out successfully!' : 'تم تسجيل الخروج بنجاح!',
            buttons: [this.globalService.language == 'en' ? 'OK' : 'تم']
          });
          alert.present();
        }
        else if (this.navCtrl.getActive().component != page.component) {
          {
            let foundp = false;
            this.navCtrl.getViews().forEach((object, index) => {
              if (object.component == page.component) {
                console.log('i found ' + page.component.name + ' poping to it ? at index: ' + index);
                console.log(this.navCtrl.getViews()[index]);
                foundp = true;
                this.navCtrl.popTo(index);
              }
            });
            if (!foundp) {
              console.log("pushing " + page.component.name + " for the first time");
              this.navCtrl.push(page.component);
            }
          }
        } else {
          console.log("elsegoing to the same page are ? ");
        }
      }
    });
  }
  postOrder() {
    if (this.payment == 'cod') {
      let loader = this.loadingCtrl.create({});
      loader.present();
      this.globalService.submitOrder(this.address, this.comment, this.lat, this.lng)
        .subscribe(
          data => {
            // console.log(data);
            loader.dismissAll();
            if (data.error != null) {
              let toast = this.toastCtrl.create({
                message: data.error,
                duration: 4000,
              });
              toast.present();
            }
            else {
              let toast = this.toastCtrl.create({
                message: this.globalService.language == 'en' ? 'Order Completed.' : 'تم الطلب بنجاح',
                duration: 4000,
              });
              toast.present();
              this.getHome();
            }
          }
        );
    }
    // else if (this.payment == 'paypal') {
    // console.log('paying at: \n' + 'http://mobile.tamweencom.com/finishorder?userid=' + this.globalService.user.userid +
    //   '&address=' + this.address + '&comment=' + this.comment);
    // this.navCtrl.push(PaypalPage);
    // window.open('http://mobile.tamweencom.com/finishorder?userid=' + this.globalService.user.userid +
    //   '&address=' + this.address + '&comment=' + this.comment
    //   , "_system");
    // }

  }

  getHome() {
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
      this.navCtrl.push(homePage);
    }
  }
}
