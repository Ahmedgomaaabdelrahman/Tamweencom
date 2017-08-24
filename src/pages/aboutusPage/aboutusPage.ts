import {Component} from '@angular/core';
import {NavController, LoadingController, PopoverController, AlertController} from 'ionic-angular';
import {globalService} from "../Services/globalService";
import {PopoverPage} from "../popover/popover";
import {signinPage} from "../signinPage/signinPage";
import {cartPage} from "../cartPage/cartPage";
import {search} from "../search/search";

@Component({
  selector: 'aboutusPage',
  templateUrl: 'aboutusPage.html'
})

export class AboutUsPage {

  public about: any;
  public title: string = "";
  public cartNo : any = globalService;
  public mytext: string = "";
  loader: any;

  constructor(public navCtrl: NavController, public globallService: globalService, public loadingCtrl: LoadingController,
              public popoverCtrl: PopoverController, public alertCtrl: AlertController) {
    this.loader = this.loadingCtrl.create({
      content: " ",
    });
    this.loader.present();
    this.getDataFromServer();
    
    
  }
   getCart() {
   this.navCtrl.push(cartPage);
   /*if (this.globalService.loggedIn) {
    }
    else {
      this.showLoginAlert();
    }
    */
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
  ionViewDidLoad() {


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
  getDataFromServer() {
    this.globallService.getAbout()
      .subscribe(
        (data) => {
          this.about = data;
          this.title = data.title;
          this.mytext = data.text;
          this.loader.dismissAll();
        }
      );
  }

}
