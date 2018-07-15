import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TestProvider } from "../../providers/test/test";

import { Estilo } from '../../clases/estilo';

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  public estilo:Estilo;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private servicio:TestProvider
  ) {
  }

  ionViewDidLoad() {
    this.estilo = new Estilo();
    this.estilo.setCorreo('juan@carlos.com');
    this.estilo.setEstiloBtn('Naif');
    this.estilo.setEstiloFondo('Argentina');

    this.servicio.guardarEstilo(this.estilo);

    this.servicio.traerEstiloPorCorreo('juan@juan.com').subscribe(e=>{
      //retorna el registro por el correo
      console.log(e);
    });
  }

}
