import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AlumnoServiceProvider } from "../../providers/alumno-service/alumno-service";
import * as Chart from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-graf-asist-alumnos',
  templateUrl: 'graf-asist-alumnos.html',
})
export class GrafAsistAlumnosPage {

  public materia:string;
  public dataa:any;
  public pieChartLabels:string[] = ['% ASISTENCIAS', '% FALTAS'];
  public pieChartData:number[];
  public pieChartType:string = 'pie';
  private profesor_name:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private alumnoDB:AlumnoServiceProvider, public zone:NgZone
  ) {
      
      
  }

  ionViewWillEnter(){
    this.materia = this.navParams.get('materia');
    this.profesor_name = this.navParams.get('profesor');
    this.getDataPie();

    
  }

  ionViewDidLoad() {

  }

  public chartClicked(e:any):void {
    //console.log(e);
  }
 
  public chartHovered(e:any):void {
    //console.log(e);
  }

  private getDataPie(){
    let porcentaje_asistencia:number=0;
    let porcentaje_faltas:number=0;
    let resultadoPreOperacion:any = {};
    let resultadoFinal:Array<number> = new Array<number>();
    let contador_asistencias:number = 0;
    let contador_faltas:number = 0;

    this.alumnoDB.promedioAlumnosAll(this.materia.trim()).subscribe(asistencia=>{
      asistencia.forEach(datas => {
        console.log(datas);
        datas.asistieron.forEach(alumno => {
          console.log(alumno);
          if (alumno!= undefined) {
            if (this.boolMateriasProfesorCoinciden(alumno)) {
              contador_asistencias += 1;
            }
          } 
        });
      });

      asistencia.forEach(datas => {
        console.log(datas);
        if (datas.faltaron != undefined) {
          datas.faltaron.forEach(alumno => {
            console.log(alumno);
            if (alumno != undefined) {
              if (this.boolMateriasProfesorCoinciden(alumno)) {
                contador_faltas += 1;
              }
            }
          });
        }
      });
      //console.log(contador_asistencias, ';', contador_faltas);
      resultadoPreOperacion.asistencias = contador_asistencias;
      resultadoPreOperacion.faltas = contador_faltas;
      let suma:number = resultadoPreOperacion.asistencias + resultadoPreOperacion.faltas;
       porcentaje_asistencia = (resultadoPreOperacion.asistencias * 100) / suma;
       porcentaje_faltas = (resultadoPreOperacion.faltas * 100) / suma;
       resultadoFinal.push(Math.round(porcentaje_asistencia));
       resultadoFinal.push(Math.round(porcentaje_faltas));
       //console.log(resultadoFinal);
       this.pieChartData = resultadoFinal;
       //console.log(this.pieChartData);
    });
    
  }

  private boolMateriasProfesorCoinciden(alumno:string):boolean{
    let bool:boolean = false;
    let _alumno:string = alumno;
    let _materia:string;
    let arrayAlumno:Array<string> = new Array<string>();
    
    arrayAlumno = _alumno.split('/');
    //console.log(arrayAlumno);
    let _profesor_name:string = arrayAlumno[1].substring(arrayAlumno[1].lastIndexOf('-')+1);
    //console.log(_profesor_name);
    _materia = arrayAlumno[1].substring(arrayAlumno[1].indexOf('-')+1, arrayAlumno[1].lastIndexOf('-'));
    if (_materia==this.materia && _profesor_name == this.profesor_name) {
        bool = true;
    }else{
      bool = false;
    }
    return bool;
  }

}
