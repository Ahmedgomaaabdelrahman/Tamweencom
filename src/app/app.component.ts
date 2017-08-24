import {Component, ViewChild} from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { CacheService } from "ionic-cache";
import {Nav, Platform, ToastController, AlertController} from 'ionic-angular';
import {StatusBar, InAppBrowser} from 'ionic-native';
import { SplashScreen } from '@ionic-native/splash-screen';
import {homePage} from '../pages/homePage/homePage';
import {categoriesPage} from '../pages/categoriesPage/categoriesPage';
import {languagePage} from '../pages/languagePage/languagePage';
import {signinPage} from '../pages/signinPage/signinPage';
import {signupPage} from '../pages/signupPage/signupPage';
import {Storage} from '@ionic/storage';
import {globalService} from "../pages/Services/globalService";
import {editProfile} from "../pages/editProfile/editProfile";
import {historyPage} from "../pages/ordersHistoryPage/historyPage";
import {TranslateService} from 'ng2-translate/src/translate.service';
import {filterPage} from '../pages/filterPage/filterPage';
import {Geolocation} from "ionic-native";
import {ContactUsPage} from "../pages/contactusPage/contactusPage";
import {AboutUsPage} from "../pages/aboutusPage/aboutusPage";
import {TermsPage} from "../pages/termsPage/termsPage";
import {driverPage} from "../pages/driverPage/driverPage";
import {Splashscreen} from 'ionic-native';
import {categoriesPageWHeader} from "../pages/categoriesPageWHeader/categoriesPageWHeader";
import {cartPage} from "../pages/cartPage/cartPage";
import {wishPage} from "../pages/wishPage/wishPage";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public flagepicpath;
  public cartNo : any = globalService;
  rootPage: any = languagePage;
  public user: any;
  pages: Array<{title: string, icon: string, atv: string,component: any}>;
  pageslogged: Array<{title: string, icon: string, atv: string,component: any}>;
  pagesDriver: Array<{title: string, icon: string, atv: string,component: any}>;

  constructor(public cache: CacheService,public platform: Platform, public storage: Storage, public _translate: TranslateService,
    public _platform: Platform,private push:Push,
public _SplashScreen: SplashScreen,public globallService: globalService, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    
    this.initializeApp();
    this.countCart();
    
    // used for an example of ngFor and navigation
    this.pageslogged = [
      {title: 'Home', icon: 'home', atv: '', component: homePage},
      {title: 'Categories', icon: 'home', atv: '', component: categoriesPageWHeader},
      {title: 'My Basket', icon: 'basket', atv: '', component: cartPage},
      {title: 'Wish List', icon: 'heart', atv: '', component: wishPage},
      {title: 'Edit', icon: 'person-add', atv: '', component: editProfile},
      {title: 'Order History', icon: 'cart', atv: '', component: historyPage},
      {title: 'Conditions of use', icon: 'cart', atv: '', component: TermsPage},
      {title: 'About us', icon: 'information-circle', atv: '', component: AboutUsPage},
      {title: 'Contact us', icon: 'call', atv: '', component: ContactUsPage},
      {title: 'Language', icon: 'text', atv: '', component: languagePage},
      {title: 'Logout', icon: 'call', atv: '', component: categoriesPage},
    ];

    this.pages = [
      {title: 'Home', icon: 'home', atv: '', component: homePage},
      {title: 'Categories', icon: 'home', atv: '', component: categoriesPageWHeader},
      {title: 'Wish List', icon: 'heart', atv: '', component: wishPage},
      {title: 'Sign-In', icon: 'person-add', atv: '', component: signinPage},
      {title: 'Sign-Up', icon: 'person-add', atv: '', component: signupPage},
      {title: 'About us', icon: 'information-circle', atv: '', component: AboutUsPage},
      {title: 'Conditions of use', icon: 'cart', atv: '', component: TermsPage},
      {title: 'Language', icon: 'text', atv: '', component: languagePage},
      {title: 'Contact us', icon: 'call', atv: '', component: ContactUsPage},
    ];
  this.pagesDriver = [
      {title: 'Driver', icon: 'information-circle', atv: '', component: driverPage},
      {title: 'Contact us', icon: 'call', atv: '', component: ContactUsPage},
      {title: 'Language', icon: 'text', atv: '', component: languagePage},
      {title: 'Conditions of use', icon: 'cart', atv: '', component: TermsPage},
    ];

}

  tryPage() {
    this.nav.push(homePage);
  }

  setLanguage(language) {
    this.globallService.setDefaultLang(language);
  }

  hideSplashScreen() {
    if (navigator && Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
    //  this.cache.setDefaultTTL(60 * 60 * 12);
    //  this.cache.setOfflineInvalidate(false);
      StatusBar.styleDefault();
      this.hideSplashScreen();
      this.globallService.getDefaultLang()
        .then(
          data => {
            if (data == "ar") {
              this._translate.setDefaultLang("ar");
              this._translate.use("ar");
              this.globallService.language = "ar";
              this.setLanguage('ar');
            } else if (data == "en") {
              this._translate.setDefaultLang("en");
              this._translate.use("en");
              this.globallService.language = "en";
              this.setLanguage('en')
            } else {
              this.globallService.setDefaultLang('en');
              this._translate.setDefaultLang('en');
              this._translate.use("en");
              this.globallService.language = "en";
              this.setLanguage('en');
            }
          }
        );
       
       this.push.hasPermission()
          .then((res: any) => {

            if (res.isEnabled) {
              console.log('We have permission to send push notifications');
            } else {
              console.log('We do not have permission to send push notifications');
            }

          });
        const options: PushOptions = {
              android: {
                  senderID: '654208274967'
              },
              ios: {
                  senderID: '654208274967',
                  alert: 'true',
                  badge: false,
                  sound: 'true'
              },
              windows: {}
};
     
      const pushObject: PushObject = this.push.init(options);
      pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
      pushObject.on('registration').subscribe((registration: any) => console.log('Device registered',
      this.globallService.deviceToken = registration.registrationId));
      pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

      // pushObject.on('registration', (data) => {
      //   console.log("device token ->", data.registrationId);
      //   console.log();
      //   this.globalService.deviceToken = data.registrationId;
      //   //TODO - send device token to server
      // });

      pushObject.on('notification').subscribe((data) => {
        console.log('message', data.message);
        let self = this;
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.alertCtrl.create({
            title: data.title,
            message: data.message,
            buttons: [{
              text: this.globallService.language == 'en' ? 'Ignore' : 'تجاهل',
              role: 'cancel'
            }, {
              text: this.globallService.language == 'en' ? 'Orders' : 'الطلبات',
              handler: () => {
                //TODO: Your logic here. khaled - change it to driver component if its not working
                // self.nav.push(historyPage, {message: data.message});
                self.nav.push(driverPage);
                // this.showAlert(data);
                console.log(data);
                // this.showAlertzard(data.message);
              }
            }]
          });
          confirmAlert.present();
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly. khaled - change it to driver component if its not working
          self.nav.push(driverPage);
          console.log("Push notification clicked");
        }
      });
      pushObject.on('error').subscribe((e) => {
        console.log(e.message);
      });
    setTimeout(() => {
        this._SplashScreen.hide();
      }, 100);
  });
  }
    countCart(){
       this.globallService.getCount().subscribe((res) => {
       globalService.cartNo = res.count;
       
    });
  }
  edit() {
    this.nav.push(editProfile);
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: this.globallService.language == 'en' ? 'Logged out' : 'تسجيل الخروج',
      subTitle: this.globallService.language == 'en' ? 'Logged out successfully!' : 'تم تسجيل الخروج بنجاح!',
      buttons: [this.globallService.language == 'en' ? 'OK' : 'تم']
    });
    alert.present();
  }

  openPage(page) {
    if (this.nav.getActive().component != page.component) {
      if (page.title == "Logout") {
        this.globallService.logout();
        if (this.nav.getActive().component != homePage) {
          this.nav.popToRoot();
        }
        this.showAlert();
        // console.log("logging out");
      } else if (page.component == homePage) {
        let foundh = false;
        this.nav.getViews().forEach((object, index) => {
          if (object.component == homePage) {
            console.log('i found home page poping to it ? at index: ' + index);
            console.log(this.nav.getViews()[index]);
            foundh = true;
            this.nav.popTo(index);
          }
        });
        if (!foundh) {
          console.log("pushing home page for the first time");
          this.nav.push(homePage);
        }
        // console.log("popping to homepage");
      } else if (page.title == "Jobs" || page.title == "Media center") {
        page.title == 'Jobs' ?
          new InAppBrowser('http://mobile.tamweencom.com/jobs', 'random_string', 'location=no') :
          new InAppBrowser('http://mobile.tamweencom.com/branches', 'random_string', 'location=no');
      } else {
        let foundp = false;
        this.nav.getViews().forEach((object, index) => {
          if (object.component == page.component) {
            console.log('i found ' + page.component.name + ' poping to it ? at index: ' + index);
            console.log(this.nav.getViews()[index]);
            foundp = true;
            this.nav.popTo(index);
          }
        });
        if (!foundp) {
          console.log("pushing " + page.component.name + " for the first time");
          this.nav.push(page.component);
        }
      }
    } else {
      console.log("elsegoing to the same page are ? ");
    }
  }
  signinPage() {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(signinPage);
  }
}
