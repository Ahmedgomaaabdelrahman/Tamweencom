import {Component, ViewChild} from '@angular/core';
import {NavController, PopoverController, ToastController, AlertController, InfiniteScroll} from 'ionic-angular';
import {newArrivalsService} from './newArrivalService';
import {PopoverPage} from '../popover/popover';
import {globalService} from "../Services/globalService";
import {signinPage} from "../signinPage/signinPage";
import {singleDetails} from "../singleDetails/singleDetails";
import {homePage} from "../homepage/homepage";


declare var cartNo : any ;

@Component({
  selector: 'newArrivals',
  templateUrl: 'newArrivals.html'
})

export class newArrival {
  // responseModel: Array<any> [] = [];
  public newProducts: Array<any> [] = [];
  public productDetails;
  public home : homePage ;
  
  
  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController,
              private newProductService: newArrivalsService, private globalService: globalService,
              public toastCtrl: ToastController, public alertCtrl: AlertController) {
    console.log('Hello from new arrivals');
    
  }
  details(productID: string) {
    console.log(productID);
    this.globalService.productDetails = productID;
    this.navCtrl.push(singleDetails);
  }
 ngOnInit() {
    this.getnewProducts();
  }
  getnewProducts() {
    this.newProductService.getnewArrivals()
      .subscribe(
        data => {
          console.log(data);
          this.newProducts = data;
        }, (err => {
          console.log(err);
        })
      );
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
  addToCart(productid) {
    this.globalService.addToCart(productid).subscribe((data) => {
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
            message: this.globalService.language == "en" ? "Product Already in your cart" : "المنتج مضاف بالفعل فى قائمه المشتريات",
            duration: 4000,
          });
          toast.present();
      }
      else {
        
        let toast = this.toastCtrl.create({
          message: this.globalService.language == "en" ? "Item added to your basket." : "تمت الاضافة الى قائمة المشتريات",
          duration: 4000,
        });
        toast.present();
        this.countCart();
      }
    });
    
    /*
    if (this.globalService.loggedIn) {
    } else {
      this.showLoginAlert();
    }
    */
  }
   countCart(){
      this.globalService.getCount().subscribe((res) => {
       globalService.cartNo= res.count;
      
    });
  }
  addToWish(productid) {
    this.globalService.addToWish(productid).subscribe((data) => {
      // console.log(data);
      if (data.error != null) {
        if (data.error == "product has been added to your wishlist") {
          let toast = this.toastCtrl.create({
            message: this.globalService.language == "en" ? "Product has been added to your wishlist." : "تمت اضافة المنتج الى قائمة الرغبات",
            duration: 4000,
          });
          toast.present();
        } else if (data.error == "Product already exist in your wishlist") {
          let toast = this.toastCtrl.create({
            message: this.globalService.language == "en" ? "Product already exists in your wishlist." : "المنتج موجود بالفعل فى قائمة الرغبات",
            duration: 4000,
          });
          toast.present();
        }
        console.log(data.error);

      }
      else {
        //It comes in error -_-
        let toast = this.toastCtrl.create({
          message: this.globalService.language == "en" ? "Item added." : "تمت الاضافة",
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
