import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CacheModule } from "ionic-cache";
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { StatusBar } from '@ionic-native/status-bar';
import {MyApp} from './app.component';
import {homePage} from '../pages/homePage/homePage';
import {categoriesPage} from '../pages/categoriesPage/categoriesPage';
import {signinPage} from '../pages/signinPage/signinPage';
import {signupPage} from '../pages/signupPage/signupPage';
import {editProfile} from '../pages/editProfile/editProfile';
import {Page1} from '../pages/empty_page/page1';
import {PopoverPage} from '../pages/popover/popover';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import {singleProduct} from '../pages/singleProducts/single';
import {newArrival} from '../pages/newArrivals/newArrival';
import {hotoffers} from '../pages/hotoffers/hotoffers';
import {bestoffers} from '../pages/bestoffers/bestoffers';
import {HttpCategoryService} from '../pages/categoriesPage/categoryService';
import {singleService} from  '../pages/singleProducts/singleService';
import {HttpHomeService} from '../pages/homePage/homeService';
import {bestofferssService} from '../pages/bestoffers/bestoffersService';
import {hotoffersService} from '../pages/hotoffers/hotoffersService';
import {HttpSignUpService} from '../pages/signupPage/signUpService';
import {HttpSigninService} from '../pages/signinPage/signinPageservice';
import {newArrivalsService} from '../pages/newArrivals/newArrivalService';
import {globalService} from '../pages/Services/globalService';
import {TranslateModule} from "ng2-translate/ng2-translate";
import {TranslateLoader, TranslateStaticLoader} from "ng2-translate/src/translate.service";
import {Http} from "@angular/http";
import {languagePage} from "../pages/languagePage/languagePage";
import {search} from "../pages/search/search";
import {filterPage} from '../pages/filterPage/filterPage';
import {sortPage} from '../pages/sortPage/sortPage';
import {wishPage} from '../pages/wishPage/wishPage';
import {cartPage} from '../pages/cartPage/cartPage';
import {ContactUsPage} from "../pages/contactusPage/contactusPage";
import {TermsPage} from "../pages/termsPage/termsPage";
import {AboutUsPage} from "../pages/aboutusPage/aboutusPage";
import {historyPage} from "../pages/ordersHistoryPage/historyPage";
import {checkoutPage} from "../pages/checkoutPage/checkoutPage";
import {AboutPage} from "../pages/about/about";
import {driverPage} from "../pages/driverPage/driverPage";
import {map} from "../pages/mapDriver/map";
import {checkDetails} from "../pages/moreDetails/check";
import {singleDetails} from "../pages/singleDetails/singleDetails";
import {categoriesPageWHeader} from "../pages/categoriesPageWHeader/categoriesPageWHeader";
import {categoriesPageWHeaderService} from "../pages/categoriesPageWHeader/categoriesPageWHeaderService";
import {driverhomePage} from "../pages/driverhomePage/driverhomePage";

export function TranslateLoaderFactory(http: any) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
@NgModule({
  declarations: [
    MyApp,
    homePage,
    newArrival,
    categoriesPage,
    languagePage,
    signinPage,
    Page1,
    editProfile,
    hotoffers,
    bestoffers,
    singleProduct,
    signupPage,
    PopoverPage,
    search,
    driverPage,
    filterPage,
    sortPage,
    wishPage,
    cartPage,
    ContactUsPage,
    TermsPage,
    AboutUsPage,
    historyPage,
    checkoutPage,
    AboutPage,
    map,
    checkDetails,
    singleDetails,
    categoriesPageWHeader,
    driverhomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: TranslateLoaderFactory,
      deps: [Http]
    }),
    CacheModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    homePage,
    newArrival,
    categoriesPage,
    languagePage,
    signinPage,
    signupPage,
    hotoffers,
    editProfile,
    bestoffers,
    Page1,
    singleProduct,
    PopoverPage,
    search,
    filterPage,
    sortPage,
    driverPage,
    wishPage,
    cartPage,
    ContactUsPage,
    TermsPage,
    AboutUsPage,
    historyPage,
    checkoutPage,
    AboutPage,
    map,
    checkDetails,
    singleDetails,
    categoriesPageWHeader,
    driverhomePage
  ],
  providers: [ globalService,StatusBar, HttpCategoryService, singleService, HttpHomeService,SplashScreen,Push,
    bestofferssService, hotoffersService, newArrivalsService, HttpSignUpService, HttpSigninService,categoriesPageWHeaderService]
})
export class AppModule {
}
