import {Component} from '@angular/core';

import {NavController, LoadingController, PopoverController, AlertController, ToastController} from 'ionic-angular';
import {globalService} from "../Services/globalService";
import {PopoverPage} from "../popover/popover";
import {signinPage} from "../signinPage/signinPage";
import {search} from "../search/search";
import {cartPage} from "../cartPage/cartPage";

@Component({
  selector: 'singleDetails',
  templateUrl: 'singleDetails.html'
})
export class singleDetails {
  public title: string = "";
  public productname: string = "";
  public cartNo : any = globalService;
  public details: string = "";
  public productID: string = "";
  public productpicpath: string = "";
  public productprice: string = "";
  constructor(public navCtrl: NavController, public globallService: globalService,
              public popoverCtrl: PopoverController , public alertCtrl:AlertController,public toastCtrl: ToastController) {
    this.getDataFromServer();
    
  }
 getCart() {
    if (this.globallService.loggedIn) {
      this.navCtrl.push(cartPage);
    }
    else {
      this.showLoginAlert();
    }
  }
  getDataFromServer() {
    this.globallService.getDetails()
      .subscribe(
        (data) => {
          console.log("details")
          console.log(data)
          this.details = data.detail;
          this.productname = data.productname;
          this.productpicpath = data.picpath;
          this.productprice = data.price;
          this.productID = data.productid;
        }
      );
  }


  addToCart(productid) {
    this.globallService.addToCart(productid).subscribe((data) => {
      // console.log(data);
      if (data.error != null) {
        console.log(data.error);
        let toast = this.toastCtrl.create({
          message: data.error,
          duration: 4000,
        });
         
        toast.present();
      }
      else if (data.error == "Product Already in your cart"){
        let toast = this.toastCtrl.create({
            message: this.globallService.language == "en" ? "Product Already in your cart" : "المنتج مضاف بالفعل فى قائمه المشتريات",
            duration: 4000,
          });
          toast.present();
      }
      else {
        let toast = this.toastCtrl.create({
          message: this.globallService.language == "en" ? "Item added to your basket." : "تمت الاضافة الى قائمة المشتريات",
          duration: 4000,
        });
        toast.present();
        this.countCart();
      }
    });
    /*if (this.globalService.loggedIn) {
    } else {
      this.showLoginAlert();
    }*/
  }
 countCart(){
       this.globallService.getCount().subscribe((res) => {
       globalService.cartNo = res.count;
    });
  }
  addToWish(productid) {
    this.globallService.addToWish(productid).subscribe((data) => {
      // console.log(data);
      if (data.error != null) {
        if (data.error == "product has been added to your wishlist"){
          let toast = this.toastCtrl.create({
            message: this.globallService.language == "en" ? "Product has been added to your wishlist.": "تمت اضافة المنتج الى قائمة الرغبات",
            duration: 4000,
          });
          toast.present();
        }else if (data.error == "Product already exist in your wishlist"){
          let toast = this.toastCtrl.create({
            message: this.globallService.language == "en" ? "Product already exists in your wishlist.": "المنتج موجود بالفعل فى قائمة الرغبات",
            duration: 4000,
          });
          toast.present();
        }
        console.log(data.error);

      }
      else {
        //It comes in error -_-
        let toast = this.toastCtrl.create({
          message: this.globallService.language == "en" ? "Item added." : "تمت الاضافة",
          duration: 4000,
        });
        toast.present();
      }
    });
    /*if (this.globalService.loggedIn) {

    } else {
      this.showLoginAlert();
    }*/
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
            /*this.navCtrl.push(signinPage);*/
          }        }
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
  search(){
    this.navCtrl.push(search);
  }
}
