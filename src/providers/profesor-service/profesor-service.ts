import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth'

import { Profesor } from "../../clases/profesor";

@Injectable()
export class ProfesorServiceProvider {

  private listaMaterias:FirebaseListObservable<any[]>;
  private listaProfesores:FirebaseListObservable<any[]>;
  private listaAlumnosPorProfesor:FirebaseListObservable<string[]>;

  constructor(private db:AngularFireDatabase, private auth:AngularFireAuth) {

  }


  public traerListadoMaterias():FirebaseListObservable<any[]>{
    this.listaMaterias = this.db.list('materias') as FirebaseListObservable<any>;
    return this.listaMaterias;
  }

  public guardarProfesor(profesor:Profesor){
    profesor.setPerfil('profesor');
    this.db.app.database().ref('/profesores').child(profesor.getDNI()).set(profesor);
    this.db.app.database().ref('/usuarios').child(profesor.getDNI()).push(profesor);
    this.auth.auth.createUserWithEmailAndPassword(profesor.getCorreo(), profesor.getPassword());
  }


  public traerListadoMateriasPorProfesor(dni?:string, materia?:any):FirebaseListObservable<any[]>{
    this.listaMaterias = this.db.list('/profesores', {
      query:{
        orderByChild:'dni',
        equalTo:dni
      }
    }) as FirebaseListObservable<any[]>
    console.log('materias por profesor: ', this.listaMaterias);
    return this.listaMaterias;
  }


  public getMateriasProfesorPorCorreo(id:string){
    //let lista:FirebaseListObservable<any[]>;
    let listaMaterias:any[];
    this.db.list('/profesores').subscribe(profesores=>{
      profesores.forEach(profesor => {
        console.log(profesor);
        if (profesor["dni"]==id) {
          listaMaterias = profesor["materias"];
          console.log(listaMaterias);
        }
      });
    });
    console.log(listaMaterias);
    return listaMaterias;
  }

  public getMateriasDelProfesor(correo:string){
    //let lista:FirebaseListObservable<any[]>;
    let listaMaterias:string[] = [];
    this.db.list('/profesores').subscribe(profesores=>{
      profesores.forEach(profesor => {
        console.log(profesor);
        if (profesor["correo"]==correo) {
          listaMaterias.push(profesor["materias"]);
          console.log(listaMaterias);
        }
      });
      console.log(listaMaterias);
      
    });
    return listaMaterias;
  }

 public getProfesoresLista(){
    this.listaProfesores = this.db.list('/profesores') as FirebaseListObservable<any[]>;
    return this.listaProfesores;
  }

  public borrarProfesor(dni:string){
    this.db.app.database().ref('/profesores/' + dni).remove();
  }

  public modificarProfesor(profesor:Profesor){
    this.db.app.database().ref('/profesores/' + profesor.getDNI()).update(profesor);
  }

  public getDiaSemana():string{
    let diaSemana:string="";
    let diaNumero:number = new Date().getDay();

    switch (diaNumero) {
      case 0:
        diaSemana = "domingo";
      break;
      case 1:
        diaSemana = "lunes";
      break;
      case 2:
        diaSemana = "martes";
      break;
      case 3:
        diaSemana = "miercoles";
      break;
      case 4:
        diaSemana = "jueves";
      break;
      case 5:
        diaSemana = "viernes";
      break;
      case 6:
        diaSemana = "sabado";
      break;
      default:
        break;
    }
    return diaSemana;
  }


  public getProfesoresPorDia(){
    let profesorMateris:Array<any> = new Array<any>();
    let materiasPorDia:Array<any> = new Array<any>();
    let dia:string=this.getDiaSemana();
    //console.log(dia);
   
    this.db.list('/materias').subscribe(materias=>{
      console.log(materias);
      materias.forEach(materia => {
        console.log(materia);
        let _horario:string = materia.horarios;
        console.log(_horario);
        let _horario_dia:string = _horario.substring(0, _horario.indexOf(' ')); 
        console.log(_horario_dia);
        if (_horario_dia.toLowerCase() == dia.toLowerCase()) {
          materiasPorDia.push(materia.nombre);
        }
      });

      this.db.list('/profesores').subscribe(profesores=>{
        profesores.forEach(profesor => {
          profesor.materias.forEach(materia => {
            console.log(materia);
            let _materia:string = materia;
            if (materiasPorDia.includes(_materia)) {
              profesorMateris.push(profesor.nombre + '-' + _materia);
            }
          });
        });// /profesores
      })

    }); // /materias
    console.log(profesorMateris); //
    return profesorMateris;
  }


  public getAlumnosPorProfesor(correo:string, materia:string):Array<string>{
    let alumnos:string[] = new Array<string>();
    //this.listaAlumnosPorProfesor = new FirebaseListObservable<string[]>;
    this.db.list('/alumnos').subscribe(alumnos=>{
      alumnos.forEach(a => {
        console.log(a.materias);
        if (a.materias!=undefined) {
          let materias:string[] = a.materias;
          console.log(materias);
          materias.forEach(m => {
            let mat:string = m;
            console.log(m);
            console.log(materia);
            if (mat==materia) {
              console.log('son iguales');
              alumnos.push(a.legajo + '-' + a.nombre);
              //console.log(a.nombre);
              //this.listaAlumnosPorProfesor.push(a.nombre);
            }
          });
        }
       
      });
      console.log(alumnos);
  
    });
    return alumnos;
  }

}
