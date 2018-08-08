import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlumnoServiceProvider } from "../../providers/alumno-service/alumno-service";

@IonicPage()
@Component({
  selector: 'page-ver-asistencias',
  templateUrl: 'ver-asistencias.html',
})
export class VerAsistenciasPage {

  public nombre:string;
  public legajo:string;
  public asistencias_total:number;
  public faltas_total:number;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private alumnoDB:AlumnoServiceProvider
  ) {}

  ionViewWillEnter(){
    this.nombre = this.navParams.get('nombre');
    this.legajo = this.navParams.get('legajo');
    this.asistencias_total = this.alumnoDB.getAsistenciasTotales(this.legajo, this.navParams.get('materia'), this.navParams.get('profesor'));
    this.faltas_total = this.alumnoDB.getFaltasTotales(this.legajo, this.navParams.get('materia'), this.navParams.get('profesor'));
  }

  ionViewDidLoad() {
    //console.log(this.navParams.data);

  }

}
