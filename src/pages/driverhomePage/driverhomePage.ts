import {Component} from '@angular/core';
import {PopoverPage} from "../popover/popover";
import {signinPage} from "../signinPage/signinPage";
import {globalService} from "../Services/globalService";
import {AlertController, PopoverController, NavController} from "ionic-angular";

@Component({
  selector: 'driverhomePage',
  templateUrl: 'driverhomePage.html'
})

export class driverhomePage {
  constructor(public globalService: globalService, public alertCtrl: AlertController,public popoverCtrl: PopoverController, public navCtrl: NavController) {

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
}
