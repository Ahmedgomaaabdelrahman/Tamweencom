import {Component} from '@angular/core';
import {
  NavController,
  PopoverController,
  Platform,
  AlertController,
  LoadingController,
  ToastController
} from 'ionic-angular';
import {PopoverPage} from '../popover/popover';
import {singleService} from './singleService';
import {globalService} from "../Services/globalService";
import {signinPage} from "../signinPage/signinPage";
import {singleDetails} from "../singleDetails/singleDetails";
import {cartPage} from "../cartPage/cartPage";
import {search} from "../search/search";
@Component({
  selector: 'single',
  templateUrl: 'single.html'
})
export class singleProduct {
  public productsDetails;
  id: any;
  public cart : any [] = [] ;
  public cartNo : any = globalService;
  public flag : any = globalService;
  public productsName;

  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController,
              public platform: Platform, private _httpProductService: singleService,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController,
              public globallService: globalService, public toastCtrl: ToastController) {
                this.countCart();
  }

  
  getCart() {
    this.navCtrl.push(cartPage);
  }
   countCart(){
       this.globallService.getCount().subscribe((res) => {
       globalService.cartNo = res.count;
    });
  }
  ionViewDidLoad() {
    this.getDataFromServer(); 
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
  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.globallService.language == "en" ? 'Sort' : 'ترتيب');
    alert.addInput({
      type: 'radio',
      label: this.globallService.language == "en" ? 'Name A-Z' : 'الاسم أ الى ى',
      value: 'NameASC',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: this.globallService.language == "en" ? 'Name Z-A' : 'الاسم ى الى أ',
      value: 'NameDESC'
    });

    alert.addInput({
      type: 'radio',
      label: this.globallService.language == "en" ? 'Price High to Low' : 'السعر من الاعلى الى الاقل',
      value: 'PriceHigh'
    });

    alert.addInput({
      type: 'radio',
      label: this.globallService.language == "en" ? 'Price Low to High' : 'السعر من الاقل الى الاعلى',
      value: 'PriceLow'
    });


    alert.addButton(this.globallService.language == "en" ? 'Cancel' : 'الغاء');
    alert.addButton({
      text: this.globallService.language == "en" ? 'OK' : 'تم',
      handler: data => {
        // console.log(data);
        this.sortItems(data);
        // this.testRadioOpen = false;
        // this.testRadioResult = data;
      }
    });
    alert.present();
  }

  filter() {
    this.showRadio();
  }

  showLoginAlert() {
    let alert = this.alertCtrl.create({
      title: this.globallService.language == 'en' ? 'Error' : 'خطأ',
      subTitle: this.globallService.language == 'en' ? 'Please log-in first' : 'برجاء تسجيل الدخول اولاً',
      buttons: [{
        text: this.globallService.language == 'en' ? 'OK' : 'تم',
        handler: () => {
          // this.navCtrl.popToRoot();
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
            this.navCtrl.push(signinPage);
          }
        }
      }]
    });
    alert.present();
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
            message: this.globallService.language == "en" ? "Product Already in your cart":"المنتج مضاف بالفعل فى قائمه المشتريات",
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
       this.countCart()
      }
    });
    /*if (this.globalService.loggedIn) {

    } else {
      this.showLoginAlert();
    }*/
  }
  
  addToWish(productid) {
    this.globallService.addToWish(productid).subscribe((data) => {
      // console.log(data);
      if (data.error != null) {
        if (data.error == "product has been added to your wishlist") {
          let toast = this.toastCtrl.create({
            message: this.globallService.language == "en" ? "Product has been added to your wishlist." : "تمت اضافة المنتج الى قائمة الرغبات",
            duration: 4000,
          });
          toast.present();
        } else if (data.error == "Product already exist in your wishlist") {
          let toast = this.toastCtrl.create({
            message: this.globallService.language == "en" ? "Product already exists in your wishlist." : "المنتج موجود بالفعل فى قائمة الرغبات",
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
  showConfirm() {
    let confirm = this.alertCtrl.create({
      message: this.globallService.language == 'en' ? 'No results found' : 'لم يتم العثور على اى نتائج',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

  getDataFromServer() {
    let loader = this.loadingCtrl.create({
      content: this.globallService.language == 'en' ? 'Searching...' : "جارى البحث...",
    });
    loader.present();
    // console.log("new data server" + this._httpProductService.productID);
    this._httpProductService.getProduct()
      .subscribe(
        data => {
          console.log(data);
          loader.dismissAll();
          if (data.error != null) {
            this.showConfirm();
          }
          else {
            this.productsName = data;
          }
        }
      );

  }

  details(productID: string) {
    this.globallService.productDetails = productID;
    console.log(productID);
    this.navCtrl.push(singleDetails);
  }


  private sortItems(data) {
    let loader = this.loadingCtrl.create({
      content: this.globallService.language == 'en' ? 'Searching...' : "جارى البحث...",
    });
    loader.present();
    this.globallService.filterBy(data)
      .subscribe(
        data => {
          // console.log(data);
          loader.dismissAll();
          if (data.error != null) {
            this.showConfirm();
          }
          else {
            this.productsName = data;
          }
        }
      );
  }
  search(){
    this.navCtrl.push(search);
  }
}
