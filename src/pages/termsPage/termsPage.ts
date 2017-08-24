import {Component} from '@angular/core';
import {NavController, LoadingController, AlertController, PopoverController} from 'ionic-angular';
import {globalService} from "../Services/globalService";
import {PopoverPage} from "../popover/popover";
import {signinPage} from "../signinPage/signinPage";
import {cartPage} from "../cartPage/cartPage";
import {search} from "../search/search";

@Component({
  selector: 'termsPage',
  templateUrl: 'termsPage.html'
})

export class TermsPage {
  public cart : any[] = [] ;
   public cartNo : any = globalService;
  constructor(public navCtrl: NavController, public globallService: globalService, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController, public popoverCtrl: PopoverController) {
    this.getDataFromServer();
     
  }
  
   getCart() {
     this.navCtrl.push(cartPage);
    /*if (this.globalService.loggedIn) {
    }
    else {
      this.showLoginAlert();
    }*/
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
  termsTitle: string = "";
  termsText: string = "";
  privacyTitle: string = "";
  privacyText: string = "";
  faqTitle: string = "";
  faqText: string = "";
  policyTitle: string = "";
  policyText: string = "";

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
  getDataFromServer() {
    let loader = this.loadingCtrl.create({});
    loader.present();
    this.globallService.getTerms().subscribe((data) => {
      this.termsTitle = data.title;
      this.termsText = data.text;
    });
    this.globallService.getPrivacy().subscribe((data) => {
      this.privacyTitle = data.title;
      this.privacyText = data.text;
    });
    this.globallService.getFAQ().subscribe((data) => {
      this.faqTitle = data.title;
      this.faqText = data.text;
    });
    this.globallService.getPolicy().subscribe((data) => {
      this.policyTitle = data.title;
      this.policyText = data.text;
      loader.dismissAll();
    });
  }
}
