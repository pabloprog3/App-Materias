import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth'

import { Alumno } from "../../clases/alumno";


@Injectable()
export class AlumnoServiceProvider {
  private listaMaterias:FirebaseListObservable<any[]>;
  private listaAlumnos:FirebaseListObservable<any[]>;

  constructor(private db:AngularFireDatabase, private auth:AngularFireAuth) {

  }

  public traerListadoMaterias():FirebaseListObservable<any[]>{
    this.listaMaterias = this.db.list('materias') as FirebaseListObservable<any[]>;
    return this.listaMaterias;
  }

  public traerListadoMateriasPorAlumno(legajo:string):FirebaseListObservable<any[]>{
    this.listaMaterias = this.db.list('/alumnos', {
      query:{
        orderByChild:'legajo',
        equalTo:legajo
      }
    }) as FirebaseListObservable<any[]>
    //console.log('materias por alumno: ', this.listaMaterias);
    return this.listaMaterias;
  }

  public traerMateriasPorAlumno_Correo(correo:string):FirebaseListObservable<any[]>{
    this.listaMaterias = this.db.list('/alumnos', {
      query:{
        orderByChild:'correo',
        equalTo:correo
      }
    }) as FirebaseListObservable<any[]>
    //console.log('materias por alumno: ', this.listaMaterias);
    return this.listaMaterias;
  }

  public guardarAlumno(alumno:Alumno, materias?:Array<any>):void{
    alumno.setPerfil('alumno');
    //console.log('alumno service: ', alumno);
    //this.db.app.database().ref('/alumnos').child(alumno.getLegajo()).push(alumno);
    this.db.app.database().ref('/alumnos/'+alumno.getLegajo()).set(alumno);
    this.db.app.database().ref('/usuarios').child(alumno.getLegajo()).set(alumno);
    this.db.app.database().ref('/ListadoMaterias').child(alumno.getLegajo()).set(materias);
    this.auth.auth.createUserWithEmailAndPassword(alumno.getCorreo(), alumno.getPassword());
  }

  public getAlumnosLista(){
    this.listaAlumnos = this.db.list('/alumnos') as FirebaseListObservable<any[]>;
    return this.listaAlumnos;
  }

  public getAlumnoPorCorreo(correo:string){
    let _alumno:any;
    let listado: Array<any> = new Array<any>();
    if (this.listaAlumnos==undefined) {
      this.db.list('/alumnos').subscribe(lista=>{

        lista.forEach(alumno => {
          if (alumno["correo"]==correo) {
            _alumno = alumno;
          }
        });
      });
    }
    return _alumno;
  }

  private getNameDia(dia:number):string{
    //console.log(dia);
    let diaStr:string = '';
    switch (dia) {
      case 1:
      diaStr = 'Lunes';
  break;
  case 2:
      diaStr = 'Martes';
  break;
  case 3:
      diaStr = 'Miércoles';
  break;
  case 4:
      diaStr = 'Jueves';
  break;
  case 5:
      diaStr = 'Viernes';
  break;
  case 6:
      diaStr = 'Sábado';
  break;
  case 0:
      diaStr = 'Domingo';
  break;

  default:
  break;
    }
    //console.log(diaStr);
    return diaStr.toLowerCase();
  }

  public getAlumnosTomarAsistencia(profesor:string):Array<string>{
    let date:Date = new Date();
    let diaStr:string = this.getNameDia(date.getDay());
    let listaAlumnos:Array<string> = new Array<string>();
    //console.log(diaStr);
    this.db.list('/materias').subscribe(materias=>{
      let listaMateriasDia:Array<string> = new Array<string>();
      materias.forEach(materia => {
        //console.log(materia);
        let horario:string = materia.horarios;
        let _dia:string = horario.substring(0, horario.indexOf(' '));
        //console.log(_dia);
        if (_dia.toLowerCase() == diaStr) {
          listaMateriasDia.push(materia.nombre);
        }
      }); //fin foreach materias
      this.db.list('/alumnos').subscribe(alumnos=>{
        //console.log(alumnos);
        alumnos.forEach(alumno => {
          //console.log(alumno.materias);
          if (alumno.materias) {
            let alumnoMaterias:Array<string> = new Array<string>();
            alumnoMaterias = alumno.materias;
            alumnoMaterias.forEach(a => {
              //console.log(a);
              if (listaMateriasDia.includes(a)) {
                listaAlumnos.push(alumno.legajo + '-' + alumno.nombre);
              }
            });
          }
     
        }); //fin foreach alumnos
      }); // fin /alumnos
      //console.log(listaMateriasDia);
      //console.log(listaAlumnos);
      //return listaAlumnos;
    }); // fin /materias
    //console.log(listaAlumnos);
    return listaAlumnos;
  }

  public getAlumnosPorMateria(materiaParam:string){
    let alumnos:Array<any> = new Array<any>();
    let listado: Array<any> = new Array<any>();
    if (this.listaAlumnos==undefined) {
      this.db.list('/alumnos').subscribe(lista=>{
        listado = lista;
        for (var i = 0; i < listado.length; i++) {
          listado[i].materias.forEach(materia => {
            if (materia == materiaParam) {
              alumnos.push(listado[i]);
            }
          });
        }
      });
    }
    return alumnos;
  }

  public getDataAsistencia(materia:string):Array<any>{
    let data:any[] = [];
    let todosAlumnos:Array<string> = new Array<string>();
    //traer los alumnos de esa materia y dia
    this.db.list('/alumnos').subscribe(alumnos=>{
      let materias:Array<string> = new Array<string>();
      alumnos.forEach(alumno=>{
        materias = alumno.materias;
        //console.log(materias);
        materias.forEach(m => {
          //console.log(m);
          if (materia.toLowerCase() == m.toLowerCase()) {
            todosAlumnos.push(alumno.legajo+'-'+alumno.nombre);
          }
        });//fin foreach materias
      }); //fin foreach alumnos
      //console.log(todosAlumnos); // OK

      todosAlumnos.forEach(t => {
        //console.log(t);
        this.db.list('/asistencia/julio/'+materia.toLowerCase()).subscribe(asistencia=>{
          //console.log(asistencia);
          asistencia.forEach(dia => {
            //console.log(dia.$key);
            let alumnos_asistieron:Array<string> = new Array<string>();
            alumnos_asistieron = dia.data;
            //console.log(alumnos_asistieron);
            if (alumnos_asistieron.includes(t)) {
              //console.log('asistio');
              let alu:object = {
                dia: dia.$key + '/07/2018',
                legajo: t.substring(0, t.indexOf('-')), 
                nombre:t.substring(t.indexOf('-')+1),
                asistio: 'Sí' 
              };
              data.push(alu);
            }else{
              //console.log('no asistio');
              let alu:object = {
                dia: dia.$key + '/07/2018',
                legajo: t.substring(0, t.indexOf('-')), 
                nombre:t.substring(t.indexOf('-')+1),
                asistio: 'No' 
              };
              data.push(alu);
            }
          });//fin foreach asistencia
          //console.log(data);
          // return data;
        });//fin subscribe /asistencia
      });
      
    }); //fin subscribe alumnos
    return data;
    //console.log(todosAlumnos);

    
  }

  public borrarAlumno(legajo:string){
    this.db.app.database().ref('/alumnos/' + legajo).remove();
  }

  public modificarAlumno(alumno:Alumno){
    this.db.app.database().ref('/alumnos/' + alumno.getLegajo()).update(alumno);
  }

  public setAsistencia(alumnos:any, mes:string, dia:number, materia:string):void{
    this.db.app.database().ref('/asistencia').child(mes).child(materia).child(dia.toString()).set(alumnos);
  }


}
