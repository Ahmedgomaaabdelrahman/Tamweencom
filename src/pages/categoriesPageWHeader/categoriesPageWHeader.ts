import {Component} from '@angular/core';
import {categoriesPageWHeaderService} from "./categoriesPageWHeaderService";
import {NavController, PopoverController, Platform, AlertController} from 'ionic-angular';
import {PopoverPage} from '../popover/popover';
import {singleProduct} from '../singleProducts/single';
import{singleService} from '../singleProducts/singleService';
import {globalService} from "../Services/globalService";
import {signinPage} from "../signinPage/signinPage";
import {search} from "../search/search";
import {cartPage} from "../cartPage/cartPage";
@Component({
  selector: 'categoriesPageWHeader',
  templateUrl: 'categoriesPageWHeader.html'
})
export class categoriesPageWHeader {

  public productsName;
  public cart : any [] = [] ;
  public cartNo : any = globalService;

  constructor(public popoverCtrl: PopoverController, public singleService: singleService,
              public navCtrl: NavController, public platform: Platform, public _httpProductService: categoriesPageWHeaderService,
              public globallService: globalService, public alertCtrl: AlertController) {
  }
  ngOnInit() {
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
  getDataFromServer() {
    this.globallService.getCategory()
      .subscribe(
        data => {
          this.productsName = data
        }
      );

  }
 gotoProductID(productID: string) {
    // console.log("category id we want" + productID);
    this.singleService.productID = productID;
    this.globallService.categoryID = productID;
    this.navCtrl.push(singleProduct);


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
  search() {
    this.navCtrl.push(search);
  }
}
