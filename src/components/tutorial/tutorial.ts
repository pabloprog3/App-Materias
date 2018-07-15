import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, PopoverController } from 'ionic-angular';
import { LoginTutPage } from '../../pages/login-tut/login-tut';
import { QrTutPage } from '../../pages/qr-tut/qr-tut';


@Component({
  selector: 'tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialComponent {

  @Input('perfil') perfil;

  constructor(private navCtrl:NavController, public popover:PopoverController) {

  }

  irLoginTut(){
    let popoverLogin = this.popover.create('LoginTutPage');
    popoverLogin.present();
  }

  irQrTut(){
    let popover = this.popover.create('QrTutPage');
    popover.present();
  }

  irPerfilTut(){
    let popover = this.popover.create('PerfilTutPage');
    popover.present();
  }

  irAltaAlumno(){
    let popover = this.popover.create('ListAlumnosTutPage');
    popover.present();
  }

  irQrAdminTut(){
    let popover = this.popover.create('QrAdminTutPage');
    popover.present();
  }

  irAltaProfesor(){
    let popover = this.popover.create('AltaProfTutPage');
    popover.present();
  }



}
