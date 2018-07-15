import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login-tut',
  templateUrl: 'login-tut.html',
})
export class LoginTutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public popover:PopoverController
  ) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginTutPage');
  }

}
