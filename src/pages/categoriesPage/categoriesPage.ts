import {Component} from '@angular/core';
import {HttpCategoryService} from "./categoryService";
import {NavController, PopoverController, Platform, AlertController} from 'ionic-angular';
import {PopoverPage} from '../popover/popover';
import {singleProduct} from '../singleProducts/single';
import {singleService} from '../singleProducts/singleService';
import {globalService} from "../Services/globalService";
import {signinPage} from "../signinPage/signinPage";
import {cartPage} from "../cartPage/cartPage";
import {search} from "../search/search";
@Component({
  selector: 'categoriesPage',
  templateUrl: 'categoriesPage.html'
})

export class categoriesPage {

  public productsName;

  constructor(public popoverCtrl: PopoverController, public singleService: singleService,
              public navCtrl: NavController, public platform: Platform, public _httpProductService: HttpCategoryService,
              public globalService: globalService, public alertCtrl:AlertController) {

  }
  ngOnInit() {
    this.getDataFromServer();

  }
   getCart() {
    if (this.globalService.loggedIn) {
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
      title: this.globalService.language == 'en' ? 'Error' : 'خطأ',
      subTitle: this.globalService.language == 'en' ? 'Please log-in first' : 'برجاء تسجيل الدخول اولاً',
      buttons: [{
        text: this.globalService.language == 'en' ? 'OK' : 'تم',
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
  getDataFromServer() {
    this._httpProductService.getCategoryRestful()
      .subscribe(
        data => {
          console.log(data);
          this.productsName = data
        }
      );

  }
  gotoProductID(productID: string) {
    // console.log("category id we want" + productID);
    this.singleService.productID = productID;
    this.globalService.categoryID = productID;
    
    this.navCtrl.push(singleProduct)
   
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
