import { Component } from '@angular/core';
import {PopoverController, ToastController, AlertController, NavController, LoadingController} from 'ionic-angular';
import { PopoverPage } from '../popover/popover';
import {globalService} from "../Services/globalService";
import {homePage} from "../homePage/homePage";
import {map} from "../mapDriver/map";
import {checkDetails} from "../moreDetails/check";
import {signinPage} from "../signinPage/signinPage";
@Component({
  selector: 'driverPage',
  templateUrl: 'driverPage.html'
})
export class driverPage {
   driverinfo:string;
  public user: any;
  comment = [];
  checkoutid:string;
  userid: string;
  confirm:any;
  address: string = "";
  lat: number = 0;
  lng: number = 0;
  constructor(public popoverCtrl: PopoverController,public loadingCtrl: LoadingController, public navCtrl: NavController ,public alertCtrl: AlertController,public toastCtrl: ToastController ,public globalService:globalService) {
    this.user = this.globalService.user;

  }
  ngOnInit() {
    this.getDataFromServer();
  }
  getDataFromServer() {
    this.globalService.getDriver().subscribe((data) => {
      console.log(data);
      this.driverinfo = data;
      console.log(this.driverinfo);
    })
  }
  confirmDriver(check: string) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    console.log(check);
    this.checkoutid = check;
    console.log(this.checkoutid);
    this.userid = this.user.userid;
    this.confirm = 1;
    console.log(this.comment);
    this.globalService.driverConfirm(this.checkoutid, this.userid, this.confirm,this.comment[this.checkoutid])
      .subscribe((data) => {
        console.log(data);
        let str = data.error;
        let foundh = false;
        if (data.error != null) {
          let toast = this.toastCtrl.create({
            message: str,
            duration: 4000,
          });
          toast.present();
        }
        else {
          // this.navCtrl.popToRoot();
          let toast = this.toastCtrl.create({
            message: 'it recieved',
            duration: 4000,
          });
          toast.present();
          this.getHome();
        }
        loading.dismissAll();
      })

  }
  getHome() {
    let foundh = false;
    this.navCtrl.getViews().forEach((object, index) => {
      if (object.component == homePage) {
        console.log('i found home page poping to it ? at index: ' + index);
        console.log(this.navCtrl.getViews()[index]);
        foundh = true;
        this.navCtrl.popTo(index);
      }
    });
    if (!foundh) {
      console.log("pushing home page for the first time");
      this.navCtrl.push(homePage);
    }
  }
  moreDetails(checkout: string){
    this.globalService.checkoutidDetails=checkout;
    this.navCtrl.push(checkDetails);
  }

  showMap(lat: string , long : string , addressD : string) {
    console.log(lat);
    console.log(long);
    console.log(addressD);
    this.globalService.myLatD = lat;
    this.globalService.myLngD = long;
    this.globalService.myAddressD = addressD;
    this.navCtrl.push(map);
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
