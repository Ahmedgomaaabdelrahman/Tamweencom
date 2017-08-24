import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Storage} from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { CacheService } from "ionic-cache";
import {TranslateService} from 'ng2-translate/src/translate.service';


@Injectable()
export class globalService {
  public user: any;
  public moneyTotal: any;
  public loggedIn: boolean = false;
  

  public language: string = "en";
  // public cartNo: number = 0;

  public countUrl :string = "http://mobile.tamweencom.com/mycart/count";
   
  public searchURL: string = "http://mobile.tamweencom.com/searchproducts/";
  private flag_location_url: string = "http://alkhadam.net/ws/en/flag/";
  private addtocart_url: string = "http://mobile.tamweencom.com/addorder";
  private addtowish_url: string = "http://mobile.tamweencom.com/wishlist";

  private wishlist_url_en: string = "http://mobile.tamweencom.com/en/mywishlist";
  private wishlist_url_ar: string = "http://mobile.tamweencom.com/ar/mywishlist";

  private cartlist_url_en: string = "http://mobile.tamweencom.com/en/mycart";
  private cartlist_url_ar: string = "http://mobile.tamweencom.com/ar/mycart";

  private deletefromcart_url: string = "http://mobile.tamweencom.com/deleteorder";
  private decreaseQuantity_url: string = "http://mobile.tamweencom.com/editmycart";
  private removewish_url: string = "http://mobile.tamweencom.com/deletewishlist";


  private aboutus_en: string = "http://mobile.tamweencom.com/en/aboutus";
  private aboutus_ar: string = "http://mobile.tamweencom.com/ar/aboutus";

  private terms_en: string = "http://mobile.tamweencom.com/en/terms";
  private terms_ar: string = "http://mobile.tamweencom.com/ar/terms";

  private privacy_en: string = "http://mobile.tamweencom.com/en/privacy";
  private privacy_ar: string = "http://mobile.tamweencom.com/ar/privacy";

  private faq_en: string = "http://mobile.tamweencom.com/en/faq";
  private faq_ar: string = "http://mobile.tamweencom.com/ar/faq";

  private policy_en: string = "http://mobile.tamweencom.com/en/policy";
  private policy_ar: string = "http://mobile.tamweencom.com/ar/policy";

  private filter_en: string = "http://mobile.tamweencom.com/en/filters";
  private filter_ar: string = "http://mobile.tamweencom.com/ar/filters";

  private ordersHistory_URL: string = "http://mobile.tamweencom.com/myorders";

  private finishOrder_URL: string = "http://mobile.tamweencom.com/finishorder";

  private editProfile_URL: string = "http://mobile.tamweencom.com/setuserinfo";

  public categoryID: string;

  private contactus_URL: string = "http://mobile.tamweencom.com/contactus";

  public deviceToken = null;
  
  public myAddress: string = "";
  public myLat;
  public myLng;
  /* khaled newApi */
  private driver_api : string = "http://mobile.tamweencom.com/driverorders";
  private driver_singleOrder = "http://mobile.tamweencom.com/singleorder";
  private driver_confirm : string = "http://mobile.tamweencom.com/confirm";
  private detailsUrl:string = "http://mobile.tamweencom.com/ar/singleproduct/";
  private categoryWithHeader_ar: string = "http://mobile.tamweencom.com/categories";
  private categoryWithHeader_en: string = "http://mobile.tamweencom.com/en/categories";
  public myAddressD: string = "";
  public myLatD: string;
  public myLngD: string;
  public checkoutidDetails: string;
  public productDetails:string;
  public static cartNo : number = 0;
 

   
  constructor(private cache: CacheService,
              private _http: Http, 
              public storage: Storage,
              public toastCtrl: ToastController, 
              public _translate: TranslateService) {
        
    

  }
  

  getDriver() :any{
    let body = JSON.stringify({"userid": this.user.userid});
    console.log(body);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.driver_api, body, options)
      .map(res => res.json());
  }

  driverConfirm(checkoutid: string, userid: string, confirm: any, comment: string): any {
    let body = JSON.stringify({
      "checkoutid": checkoutid,
      "userid": this.user.userid,
      "confirm": confirm,
      "comment": comment,

    });
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.driver_confirm, body, options)
      .map(res => res.json());
  }
  driverSingle(checkoutid: string): any {
    let body = JSON.stringify({
      "checkoutid": checkoutid
    });
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.driver_singleOrder, body, options)
      .map(res => res.json());
  }
  getCategory(): any {
    return this._http.get(this.language == "en" ? this.categoryWithHeader_en : this.categoryWithHeader_ar).map(res => res.json());
  }
  getDetails() : any{
    return this._http.get(this.detailsUrl+this.productDetails).map(res => res.json());
  }
  editProfileInfo(username: string, email: string, password: string, phone: string, image: string): any {
    let body = JSON.stringify({
      "userid": this.user.userid,
      "email": email,
      "password": password,
      "image": image,
      "username": username,
      "phone": phone
    });
    console.log(body);
    console.log(image);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.editProfile_URL, body, options)
      .map(res => res.json());
  }
  submitOrder(address, comment, lat, lng): any {
    let body = JSON.stringify({
      "userid": this.user.userid,
      "address": address,
      "comment": comment,
      "latitude": lat,
      "longitude": lng
    });
    globalService.cartNo = 0;
    console.log(body);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.finishOrder_URL, body, options)
      .map(res => res.json());

  }


  getOrdersHistory(): any {
    let body = JSON.stringify({"userid": this.user.userid});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.ordersHistory_URL, body, options)
      .map(res => res.json());
  }

  contactUs(name, email, message, phone): any {
    let body = JSON.stringify({"name": name, "email": email, "phone": phone, "message": message});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});

    return this._http.post(this.contactus_URL, body, options)
      .map(res => res.json());
  }

  filterBy(type): any {
    let body = JSON.stringify({"name": "", "price": "", "categoryid": "", "recent": ""});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});

    if (type == "NameASC") {
      body = JSON.stringify({"name": "asc", "price": "", "categoryid": this.categoryID, "recent": ""});
    } else if (type == "NameDESC") {
      body = JSON.stringify({"name": "desc", "price": "", "categoryid": this.categoryID, "recent": ""});
    } else if (type == "PriceHigh") {
      body = JSON.stringify({"name": "", "price": "desc", "categoryid": this.categoryID, "recent": ""});
    } else if (type == "PriceLow") {
      body = JSON.stringify({"name": "", "price": "asc", "categoryid": this.categoryID, "recent": ""});
    }
    return this._http.post(this.language == "en" ? this.filter_en : this.filter_ar, body, options)
      .map(res => res.json());
  }

  getAbout(): any {
    // console.log(this.language == "en" ? "suppose en" + this.language : "suppose ar" + this.language);
    return this._http.get(this.language == "en" ? this.aboutus_en : this.aboutus_ar).map(res => res.json());
  }

  getTerms(): any {
    return this._http.get(this.language == "en" ? this.terms_en : this.terms_ar).map(res => res.json());
  }

  getPrivacy(): any {
    return this._http.get(this.language == "en" ? this.privacy_en : this.privacy_ar).map(res => res.json());
  }
   
  

  getFAQ(): any {
    return this._http.get(this.language == "en" ? this.faq_en : this.faq_ar).map(res => res.json());
  }

  getPolicy(): any {
    return this._http.get(this.language == "en" ? this.policy_en : this.policy_ar).map(res => res.json());
  }


  decreaseQuantityitem(orderid, quantity): any {
    let body = JSON.stringify({"orderid": orderid, "quantity": quantity});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.decreaseQuantity_url, body, options)
      .map(res => res.json());
  }

  addToCart(productID): any {
    let body ;
      
    if(this.user != null)
      body = JSON.stringify({"productid": productID, "quantity": 1, "userid": this.user.userid});
    else
      body = JSON.stringify({"productid": productID, "quantity": 1, "gcm_regid": this.deviceToken});
  
    console.log(body);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.addtocart_url, body, options)
      .map(res => res.json());
    
  

  }
  removeFromCart(orderid): any {
    let body = JSON.stringify({"orderid": orderid});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    globalService.cartNo--;
    return this._http.post(this.deletefromcart_url, body, options)
      .map(res => res.json());

  }

  removeWish(wishlistid): any {
    let body = JSON.stringify({"wishlistid": wishlistid});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.removewish_url, body, options)
      .map(res => res.json());
  }

  addToWish(productID): any {
    let body ;
    if(this.user != null)
      body = JSON.stringify({"productid": productID, "quantity": 1, "userid": this.user.userid});
    else
      body = JSON.stringify({"productid": productID, "quantity": 1, "gcm_regid": this.deviceToken});
    console.log(body);
    console.log(this.user);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.addtowish_url, body, options)
      .map(res => res.json());
  }


  getWishList(): any {
    let body ;
    if(this.user != null)
      body = JSON.stringify({"userid": this.user.userid});
    else
      body = JSON.stringify({"gcm_regid": this.deviceToken});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.language == "en" ? this.wishlist_url_en : this.wishlist_url_ar, body, options)
      .map(res => res.json());
  }

  getCartList(): any {
    let body ;
    if(this.user != null)
       body = JSON.stringify({"userid": this.user.userid});
    else
      body = JSON.stringify({"gcm_regid": this.deviceToken});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.language == "en" ? this.cartlist_url_en : this.cartlist_url_ar, body, options)
      .map(res => res.json());
      
  }
getCount() : any {
     let body ;
    if(this.user != null)
       body = JSON.stringify({"userid": this.user.userid});
    else
      body = JSON.stringify({"gcm_regid": this.deviceToken});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.countUrl, body, options)
      .map(res => res.json());
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.deviceToken,
      duration: 300000
    });
    toast.present();
  }
  english() {
    this.language = 'en';
    this._translate.use('en');
  }

  arabic() {
    this.language = 'ar';
    this._translate.use('ar');
  }


  serachItems(searchQuery): any {
    let body = JSON.stringify({"search": searchQuery});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this._http.post(this.searchURL, body, options)
      .map(res => res.json());
  }

  getDefaultLang() {
    return this.storage.get("LANGKey");
  }

  setDefaultLang(language) {
    this.language = language;
    this.storage.set("LANGKey", language);
    language == 'en' ? this.english() : this.arabic();
  }

  setUser(user: any) {

    this.loggedIn = true;
    this.storage.set("USERKey", JSON.stringify(user));
    this.user = user;
  }

  getUser() {
    return this.storage.get("USERKey");
  }

  logout() {
    this.loggedIn = false;
    this.storage.set("USERKey", null);
    this.user = null;
    globalService.cartNo = 0 ;
  }


}
