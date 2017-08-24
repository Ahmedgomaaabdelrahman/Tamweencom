import { Component } from '@angular/core';

import { NavController, PopoverController } from 'ionic-angular';

import { PopoverPage } from '../popover/popover';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})

export class Page1 {

  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController) {
    
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ ev: event });
  }

}
