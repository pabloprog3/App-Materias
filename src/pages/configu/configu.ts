import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import {LoginPage} from '../../pages/login/login';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Estilo } from '../../clases/estilo';
import { ConfigProvider } from "../../providers/config/config";

/**
 * Generated class for the ConfiguPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-configu',
  templateUrl: 'configu.html',
})
export class ConfiguPage {

  fondo="fondoProfesional";
  boton="botonProfesional";
  boton1="botonProfesional1";
  titulo="tituloProfesional";
  logeo="admin@admin.com";
  estilo: FirebaseListObservable<any[]>;
  public Config:Estilo;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public view:ViewController,
              private af: AngularFireDatabase,
              private servicio:ConfigProvider
            ) {

              this.estilo = af.list('/estilo/');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguPage');
    this.logeo = this.navParams.get('logeo');
  }

  salir(){

    this.navCtrl.push(LoginPage,{'fondo':this.fondo,'boton':this.boton,'boton1':this.boton1,'titulo':this.titulo});
  }

  guardar(){
   
    this.Config = new Estilo();

    this.Config.setCorreo(this.logeo);
    this.Config.setEstiloBtn(this.boton);
    this.Config.setEstiloBtn1(this.boton1);
    this.Config.setEstiloFondo(this.fondo);
    this.Config.setEstiloTitulo(this.titulo);
    this.servicio.guardarEstilo(this.Config);
  }

}
