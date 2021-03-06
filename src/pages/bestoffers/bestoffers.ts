import {Component} from '@angular/core';
import {bestofferssService} from './bestoffersService';
import {NavController, ToastController, AlertController} from 'ionic-angular';
import {globalService} from "../Services/globalService";
import {signinPage} from "../signinPage/signinPage";
import {singleDetails} from "../singleDetails/singleDetails";

@Component({
  selector:'bestoffers',
  templateUrl: 'bestoffers.html'

})

export class bestoffers {
  public bestProducts;
  constructor(public navCtrl: NavController, private bestoffersService: bestofferssService,
              private globalService: globalService,
              public toastCtrl: ToastController, public alertCtrl: AlertController) {
 
  }

  details(productID : string){
    this.globalService.productDetails = productID;
    console.log(productID);
    this.navCtrl.push(singleDetails);
  }


  ngOnInit() {
    this.getbestoffers();
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
      }else if (data.error == "Product Already in your cart"){
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
    /*if (this.globalService.loggedIn) {
    } else {
      this.showLoginAlert();
    }*/
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
        if (data.error == "product has been added to your wishlist"){
          let toast = this.toastCtrl.create({
            message: this.globalService.language == "en" ? "Product has been added to your wishlist.": "تمت اضافة المنتج الى قائمة الرغبات",
            duration: 4000,
          });
          toast.present();
        }else if (data.error == "Product already exist in your wishlist"){
          let toast = this.toastCtrl.create({
            message: this.globalService.language == "en" ? "Product already exists in your wishlist.": "المنتج موجود بالفعل فى قائمة الرغبات",
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

  getbestoffers() {
    this.bestoffersService.getbestoffers()
      .subscribe(
        data => {
          this.bestProducts = data
        }
      );

  }
}
