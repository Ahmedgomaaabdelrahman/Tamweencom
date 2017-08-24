import {Component, ViewChild} from '@angular/core';
import {NavController, PopoverController, Platform,  AlertController} from 'ionic-angular';
import {PopoverPage} from '../popover/popover';
import {HttpHomeService} from './homeService';
import {Storage} from '@ionic/storage';
import {globalService} from "../Services/globalService";
import {search} from "../search/search";
import {signinPage} from "../signinPage/signinPage";
import {cartPage} from "../cartPage/cartPage";
import { newArrival } from "../newArrivals/newArrival";

@Component({
  selector: 'homePage',
  templateUrl: 'homePage.html'
})

export class homePage {
  public cartNo : any = globalService;
  
  public productsName;
  public cart : any [] = [] ;
  
  public newarr : newArrival;
  slides: Array<{ title: string, img: string }>;
  public usertype;
  routerContent = 'Categories';
  constructor(public popoverCtrl: PopoverController, public HttpHomeService: HttpHomeService,
              public storage: Storage, public navCtrl: NavController, public platform: Platform,
              public globallService: globalService, public alertCtrl: AlertController) {
                 this.countCart();
              }
  //   ionViewWillEnter()
  // {
  //   this.globalService.getCartList().subscribe((res : any[])=>{
  //     this.cart = res ;
  //     this.globalService.cartno = res.length;
  //     this.cartNo = this.globalService.cartno ;
  //   });
  // }
  
  getCart() {
    this.navCtrl.push(cartPage);
    /*if (this.globalService.loggedIn) {
    }
    else {
      this.showLoginAlert();
    }*/
  }
  countCart(){
       this.globallService.getCount().subscribe((res) => {
       globalService.cartNo = res.count;
    });
  }
  setRouter(RouterLink) {
    this.routerContent = RouterLink;
  }
  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.globallService.language = "en" ? 'Sort' : 'ترتيب حسب');
    alert.addInput({
      type: 'radio',
      label: this.globallService.language = "en" ? 'Name A-Z' : 'الاسم أ الى ى',
      value: 'NameASC',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: this.globallService.language = "en" ? 'Name Z-A' : 'الاسم ى الى أ',
      value: 'NameDESC'
    });
    alert.addInput({
      type: 'radio',
      label: this.globallService.language = "en" ? 'Price High to Low' : 'السعر من الاعلى الى الاقل',
      value: 'PriceHigh'
    });
    alert.addInput({
      type: 'radio',
      label: this.globallService.language = "en" ? 'Price Low to High' : 'السعر من الاقل الى الاعلى',
      value: 'PriceLow'
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
      }
    });
    alert.present();
  }
  filter() {
    this.showRadio();
  }
  search() {
    this.navCtrl.push(search);
  }
  getDataFromServer() {

    this.HttpHomeService.gethomeSlider()
      .subscribe(
        data => {
          this.productsName = data
        }
      );
  }
  mySlideOptions = {
    autoplay: 2750
  };
  ionViewDidLoad() {
    this.getDataFromServer();
  }

  findPage(component) {
    let foundh = false;
    this.navCtrl.getViews().forEach((object, index) => {
      if (object.component == component) {
        console.log('i found ' + component.name + ' poping to it ? at index: ' + index);
        foundh = true;
        this.navCtrl.popTo(index);
      }
    });
    if (!foundh) {
      console.log('pushing ' + component.name + ' for the first time');
      this.navCtrl.push(component);
    }
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
}
