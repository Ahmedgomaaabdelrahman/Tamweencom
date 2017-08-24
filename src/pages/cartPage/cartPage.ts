import {Component} from '@angular/core';
import {globalService} from "../Services/globalService";
import {ToastController, LoadingController, AlertController, NavController, PopoverController} from 'ionic-angular';
import {checkoutPage} from "../checkoutPage/checkoutPage";
import {PopoverPage} from "../popover/popover";
import {signinPage} from "../signinPage/signinPage";
import {search} from "../search/search";

@Component({
  selector: 'cartPage',
  templateUrl: 'cartPage.html'
})
export class cartPage {
  products: any[];
  subTotal = "sub total";
  grandTotal = "grand total";
  numSubTotal: number = 0;
  public cartNo : number = 0 ;
  numgrandTotal: number;

  constructor(public globalService: globalService,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController, public navCtrl: NavController, public popoverCtrl: PopoverController) {
 
                

    let loader = this.loadingCtrl.create({
      
      content: " ",
    });
    loader.present();
    this.globalService.getCartList().subscribe((data) => {
      loader.dismissAll();
      // console.log(data);
      // this.globalService.presentToast();
      if (data.error != null) {
        let toast = this.toastCtrl.create({
          message: data.error,
          duration: 4000,
        });
        toast.present();
        if (data.error == 'No Data Found') {
          this.showAlert();
        }
      }
      else {
        this.products = data;
        this.updatePrice();
      }
    });
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

  showAlert() {
    let alert = this.alertCtrl.create({
      title: this.globalService.language == 'en' ? 'Error' : 'خطأ',
      subTitle: this.globalService.language == 'en' ? 'Your cart is empty' : 'عربة التسوق فارغة',
      buttons: [{
        text: this.globalService.language == 'en' ? 'OK' : 'تم',
        handler: () => {
          this.navCtrl.popToRoot();
        }
      }]
    });
    alert.present();
  }

  updatePrice() {
    this.numSubTotal = 0;
    this.products.forEach(object => {
      this.numSubTotal = this.numSubTotal + (object.quantity * object.price);
    });
    // console.log(this.globalService.moneyTotal);
    this.subTotal = this.numSubTotal.toString();
  }

  addQuantity(productid) {
    let loader = this.loadingCtrl.create({
      content: " ",
    });
    loader.present();
    this.globalService.addToCart(productid).subscribe((data) => {
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
        let arrindex;
        for (var i in this.products) {
          if (this.products[i].productid == productid) {
            arrindex = i;
            break; //Stop this loop, we found it!
          }
        }
        let x: number;
        x = this.products[arrindex].quantity;
        x++;
        this.products[arrindex].quantity = x;
        this.updatePrice();
        let toast = this.toastCtrl.create({
          message: this.globalService.language == "en" ? "Item added." : "تمت الاضافة",
          duration: 4000,
        });
        toast.present();
      }
    });
   
  }

  decreaseQuantity(orderid) {
    // console.log(orderid);

    let arrindex;
    for (var i in this.products) {
      if (this.products[i].orderid == orderid) {
        arrindex = i;
        break;
      }
    }
    let x: number;
    x = this.products[arrindex].quantity;
    x--;
    // console.log(x);
    if (x == 0) {
      console.log("stop")
    } else {
      let loader = this.loadingCtrl.create({
        content: ""
      });
      loader.present();
      this.globalService.decreaseQuantityitem(orderid, x).subscribe((data) => {
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
          this.products[arrindex].quantity = x;
          this.updatePrice();
        }
      })
    }
  }

  deleteItem(orderid) {
    let loader = this.loadingCtrl.create({
      content: ""
    });
    loader.present();
    this.globalService.removeFromCart(orderid).subscribe((data) => {
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
          return obj.orderid !== orderid;
        });
        this.updatePrice();

      }
    });
  }

  checkout() {
    if(this.globalService.user != null)
    {
      this.globalService.moneyTotal = this.subTotal;
      this.navCtrl.push(checkoutPage);
    }
    else 
      this.navCtrl.push(signinPage);
  }
   search() {
    this.navCtrl.push(search);
  }

}
