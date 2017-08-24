import {Component} from '@angular/core';
import {globalService} from "../Services/globalService";
import {ToastController, LoadingController, AlertController, NavController, PopoverController} from 'ionic-angular';
import {PopoverPage} from "../popover/popover";
import {singleDetails} from "../singleDetails/singleDetails";

@Component({
  selector: 'check',
  templateUrl: 'check.html'
})
export class checkDetails {
  public products ;
  constructor(public popoverCtrl: PopoverController,public loadingCtrl: LoadingController, public navCtrl: NavController ,public alertCtrl: AlertController,public toastCtrl: ToastController ,public globalService:globalService) {
   this.globalService.driverSingle(this.globalService.checkoutidDetails).subscribe(
      (data) => {
       console.log(data);
        this.products = data;
        console.log("eha");
        console.log(this.products);
      })
  }
  details(productID : string){
    console.log(productID);
    this.globalService.productDetails = productID;
    this.navCtrl.push(singleDetails);
  }
}
