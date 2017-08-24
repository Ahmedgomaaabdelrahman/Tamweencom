import {Component} from '@angular/core';
import {NavController, ToastController, LoadingController, AlertController, PopoverController} from 'ionic-angular';
import {globalService} from "../Services/globalService";
import {PopoverPage} from "../popover/popover";
import {signinPage} from "../signinPage/signinPage";
import {checkDetails} from "../moreDetails/check";
import {cartPage} from "../cartPage/cartPage";
import {search} from "../search/search";

@Component({
  selector: 'historyPage',
  templateUrl: 'historyPage.html'
})

export class historyPage {

  ordersHistory: any[];
  public cart : any[] = [] ;
  public cartNo : any = globalService;
  constructor(public navCtrl: NavController, public globallService: globalService, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController, public popoverCtrl: PopoverController) {
                      this.getOrdersHistory();
  }
   getCart() {
    if (this.globallService.loggedIn) {
      this.navCtrl.push(cartPage);
    }
    else {
      this.showLoginAlert();
    }
  }
   search() {
    this.navCtrl.push(search);
  }
    showLoginAlert() {
    let alert = this.alertCtrl.create({
      title: this.globallService.language == 'en' ? 'Error' : 'خطأ',
      subTitle: this.globallService.language == 'en' ? 'Please log-in first' : 'برجاء تسجيل الدخول اولاً',
      buttons: [{
        text: this.globallService.language == 'en' ? 'OK' : 'تم',
        handler: () => {
          let foundh = false;
          this.navCtrl.getViews().forEach((object, index) => {
            if (object.component.name == 'signinPage') {
              console.log('i found signinPage poping to it ? at index: ' + index);
              console.log(this.navCtrl.getViews()[index]);
              foundh = true;
              this.navCtrl.popTo(index);
            }
          });
          if (!foundh) {
            console.log("pushing home page for the first time");
            this.navCtrl.push(signinPage);
          }
        }
      }]
    });
    alert.present();
  }
  go(){
    console.log("clicking");
  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: this.globallService.language == 'en' ? 'Error' : 'خطأ',
      subTitle: this.globallService.language == 'en' ? 'Please enter all fields correctly' : 'برجاء ادخال جميع البيانات بطريقة صحيحة',
      buttons: [this.globallService.language == 'en' ? 'OK' : 'تم']
    });
    alert.present();
  }

  moreDetails(checkout: string){
    this.globallService.checkoutidDetails=checkout;
    this.navCtrl.push(checkDetails);
  }
  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ev: event});
    popover.onDidDismiss(page => {
      if (page != null) {
        // if (this.globalService.loggedIn) {
        if (page.title == 'Logout') {
          this.globallService.logout();
          this.navCtrl.push(signinPage);
          let alert = this.alertCtrl.create({
            title: this.globallService.language == 'en' ? 'Logged out' : 'تسجيل الخروج',
            subTitle: this.globallService.language == 'en' ? 'Logged out successfully!' : 'تم تسجيل الخروج بنجاح!',
            buttons: [this.globallService.language == 'en' ? 'OK' : 'تم']
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
  private getOrdersHistory() {
    let loader = this.loadingCtrl.create({});
    loader.present();
    this.globallService.getOrdersHistory()
      .subscribe(
        data => {
          this.ordersHistory = data;
          loader.dismissAll();
          if (data.error != null) {
            let toast = this.toastCtrl.create({
              message: data.error,
              duration: 4000,
            });
            toast.present();
          } else {
          }
        }
      );
  }
}
