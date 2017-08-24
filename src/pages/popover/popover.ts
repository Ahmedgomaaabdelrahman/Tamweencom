import {Component} from '@angular/core';

import {ViewController, Platform, AlertController, NavController} from 'ionic-angular';

import {globalService} from "../Services/globalService";
import {signinPage} from "../signinPage/signinPage";
import {wishPage} from "../wishPage/wishPage";
import {checkoutPage} from "../checkoutPage/checkoutPage";
import {cartPage} from "../cartPage/cartPage";
import {historyPage} from "../ordersHistoryPage/historyPage";
import {editProfile} from "../editProfile/editProfile";
import {categoriesPage} from "../categoriesPage/categoriesPage";
import {homePage} from "../homePage/homePage";
import {signupPage} from "../signupPage/signupPage";
import {driverPage} from "../driverPage/driverPage";

@Component({
  templateUrl: 'popover.html'
})

export class PopoverPage {

  pages: Array<{title: string, icon: string, atv: string,component: any}>;

  constructor(public viewCtrl: ViewController, public platform: Platform,
              public globalService: globalService, public alertCtrl: AlertController) {
    // used for an example of ngFor and navigation
    if (globalService.loggedIn && globalService.user.usertype == 1) {
      console.log("55565656555555");
      console.log(globalService.user.username);
      this.pages = [
        {title: 'Driver', icon: 'information-circle', atv: '', component: driverPage},
       /* {title: 'Wish List', icon: 'heart', atv: 'active', component: wishPage},
        {title: 'My Basket', icon: 'basket', atv: '', component: cartPage},
        {title: 'Order History', icon: 'list', atv: '', component: historyPage},*/
        {title: 'Edit', icon: 'person-add', atv: '', component: editProfile},
        {title: 'Logout', icon: 'call', atv: '', component: categoriesPage},
      ];
    } else if (globalService.loggedIn && globalService.user.usertype == 0) {
      this.pages = [
        {title: 'Wish List', icon: 'heart', atv: 'active', component: wishPage},
        {title: 'My Basket', icon: 'basket', atv: '', component: cartPage},
        {title: 'Order History', icon: 'list', atv: '', component: historyPage},
        {title: 'Edit', icon: 'person-add', atv: '', component: editProfile},
        {title: 'Logout', icon: 'call', atv: '', component: categoriesPage}
      ];
    } else {
      this.pages = [
        {title: 'Sign-In', icon: 'person-add', atv: '', component: signinPage},
        {title: 'Sign-Up', icon: 'person-add', atv: '', component: signupPage}
      ];
    }
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: this.globalService.language == 'en' ? 'Logged out' : 'تسجيل الخروج',
      subTitle: this.globalService.language == 'en' ? 'Logged out successfully!' : 'تم تسجيل الخروج بنجاح!',
      buttons: [this.globalService.language == 'en' ? 'OK' : 'تم']
    });
    alert.present();
  }

  close(page) {
    this.viewCtrl.dismiss(page);
  }
}
