import {Component} from '@angular/core';
import {ToastController, LoadingController, PopoverController, NavController, AlertController} from 'ionic-angular';
import {globalService} from "../Services/globalService";
import {PopoverPage} from "../popover/popover";
import {signinPage} from "../signinPage/signinPage";
import {cartPage} from "../cartPage/cartPage";
import {search} from "../search/search";
@Component({
  selector: 'wishPage',
  templateUrl: 'wishPage.html'
})
export class wishPage {
  products: any[];
  // public popoverCtrl: PopoverController,
  loader: any;
  public cartNo : any = globalService;
  constructor(public globallService: globalService,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController, public popoverCtrl: PopoverController,
              public navCtrl: NavController, public alertCtrl: AlertController) {
    this.loader = this.loadingCtrl.create({
      content: " ",
    });
    this.loader.present();
    this.globallService.getWishList().subscribe((data) => {
       console.log(data);
      if (data.error != null) {
        let toast = this.toastCtrl.create({
          message: this.globallService.language == 'en' ? data.error : 'لا توجد منتجات حاليا',
          duration: 4000,
        });
        toast.present();
      }
      else {
        this.products = data;
      }
      this.loader.dismissAll();
    });
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
    })
  }
   countCart(){
       this.globallService.getCount().subscribe((res) => {
       globalService.cartNo = res.count;
    });
  }
  removeWish(wishlistid) {
    let loader = this.loadingCtrl.create({
      content: " ",
    });
    loader.present();
    this.globallService.removeWish(wishlistid).subscribe((data) => {
      loader.dismissAll();
      // console.log(data);
      if (data.error != null) {
        let toast = this.toastCtrl.create({
          message: data.error,
          duration: 4000,
        });
        toast.present();
      }
      else {
        this.products = this.products.filter(function (obj) {
          return obj.wishlistid !== wishlistid;
        });
        let toast = this.toastCtrl.create({
          message: this.globallService.language == "en" ? "Item removed from wish list." : "تم ازالة المنتج من القائمة",
          duration: 4000,
        });
        toast.present();
      }
    })
  }
}
