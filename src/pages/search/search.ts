import {Component} from '@angular/core';
import {
  NavController,
  Platform,
  AlertController,
  LoadingController,
  ToastController, PopoverController
} from 'ionic-angular';
import {globalService} from "../Services/globalService";
import {signinPage} from "../signinPage/signinPage";
import {PopoverPage} from "../popover/popover";
import {singleDetails} from "../singleDetails/singleDetails";
import {cartPage} from "../cartPage/cartPage";
@Component({
  selector: 'search',
  templateUrl: 'search.html'
})

export class search {
  searchQuery: string = '';
  items: any[];
  public newProducts;
  public cartNo : any = globalService;
  constructor(public navCtrl: NavController,
              public platform: Platform,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController,
              private globallService: globalService, public popoverCtrl: PopoverController,
              public toastCtrl: ToastController) {
  }
   getCart() {
    if (this.globallService.loggedIn) {
      this.navCtrl.push(cartPage);
    }
    else {
      this.showLoginAlert();
    }
  }
  showConfirm() {
    let confirm = this.alertCtrl.create({
      message: this.globallService.language == "en" ? 'No results were found.' : 'لم يتم العثور على اى نتائج',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    confirm.present();
  }
  details(productID : string){
    console.log(productID);
    this.globallService.productDetails = productID;

    this.navCtrl.push(singleDetails);
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
          this.navCtrl.popToRoot(signinPage);
        }
      }]
    });
    alert.present();
  }


  addToCart(productid) {
    if (this.globallService.loggedIn) {
      this.globallService.addToCart(productid).subscribe((data) => {
        // console.log(data);
        if (data.error != null) {
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
            message: this.globallService.language == "en" ? "Item added." : "تمت الاضافة",
            duration: 4000,
          });
          toast.present();
          this.cartNo();
        }
      })
    } else {
      this.showLoginAlert();
    }

  }
 countCart(){
       this.globallService.getCount().subscribe((res) => {
       globalService.cartNo = res.count;
    });
  }
  addToWish(productid) {
    if (this.globallService.loggedIn) {
      this.globallService.addToWish(productid).subscribe((data) => {
        // console.log(data);
        if (data.error != null) {
          let toast = this.toastCtrl.create({
            message: data.error,
            duration: 4000,
          });
          toast.present();
        }
        else {
          let toast = this.toastCtrl.create({
            message: this.globallService.language == "en" ? "Item added." : "تمت الاضافة",
            duration: 4000,
          });
          toast.present();
        }
      })
    } else {
      this.showLoginAlert();
    }
  }

  getSearch() {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    this.globallService.serachItems(this.searchQuery)
      .subscribe(
        data => {
          loader.dismissAll();
          // console.log(data);
          if (data.error != null) {
            this.showConfirm();
          }
          else {
            this.newProducts = data;
            this.items = data;
          }
        }
      );
  }
}
