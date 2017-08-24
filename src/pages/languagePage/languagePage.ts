import {Component} from '@angular/core';

import {NavController, LoadingController, PopoverController, AlertController, Platform,} from 'ionic-angular';
import {globalService} from "../Services/globalService";
import {homePage} from "../homePage/homePage";
import {signinPage} from "../signinPage/signinPage";
import {PopoverPage} from "../popover/popover";

@Component({
  selector: 'languagePage',
  templateUrl: 'languagePage.html'
})

export class languagePage {
  constructor(public navCtrl: NavController, public globalService: globalService, public loadingCtrl: LoadingController,
              public popoverCtrl: PopoverController, public alertCtrl: AlertController, public platform:Platform) {
    if (globalService.user == null) {
      let loader = this.loadingCtrl.create({});
      loader.present();
      this.globalService.getUser()
        .then(
          data => {
            let user = JSON.parse(data);
            // console.log(data);
            if (JSON.stringify(user) != "" && data != null) {
              this.globalService.setUser(user);
              this.globalService.loggedIn = true;
              this.navCtrl.setRoot(homePage);
            }
            this.defLanguage();
            loader.dismissAll();
          }
        );
    }
  }
  defLanguage() {
    this.globalService.getDefaultLang()
      .then(
        data => {
          if (data == "ar") {
            this.globalService.arabic();
            // console.log("Lang is ar: " + data);
          } else if (data == "en") {
            this.globalService.english();
            // console.log("Lang is en: " + data);
          } else {
            this.globalService.setDefaultLang('en');
            // console.log("Lang is nothing setting it to english by default: " + data);
          }
        }
      );
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

  findPage(component) {
    let foundh = false;
    this.navCtrl.getViews().forEach((object, index) => {
      if (object.component == component) {
        console.log('i found ' + component.name + ' poping to it ? at index: ' + index);
        foundh = true;
        this.navCtrl.popTo(index);
      }
    });
    if (!foundh) {
      console.log(this.navCtrl.getViews());
      console.log('pushing ' + component.name + ' for the first time');
      this.navCtrl.push(component);
    }
  }
  setLanguage(language) {
    this.globalService.setDefaultLang(language);
    if (this.globalService.loggedIn) {
      this.navCtrl.setRoot(homePage);
    } else {
      this.navCtrl.setRoot(signinPage);
    }
  }

}
