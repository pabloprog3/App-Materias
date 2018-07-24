import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Camera, CameraOptions } from "@ionic-native/camera";
import * as firebase from 'firebase';

//import { PersonasServiceProvider } from "../../providers/personas-service/personas-service";
import { AlumnoServiceProvider } from "../../providers/alumno-service/alumno-service";
import { ProfesorServiceProvider } from "../../providers/profesor-service/profesor-service";

import { Alumno } from "../../clases/alumno";
import { ConfigProvider } from "../../providers/config/config";
import {LoginPage} from '../../pages/login/login';


@IonicPage()
@Component({
  selector: 'page-alumnos-form',
  templateUrl: 'alumnos-form.html',
})
export class AlumnosFormPage {
  private perfil:string='';
  private datos:any;
  public legajo:string;
  public nombre:string;
  public correo:string;
  public foto:string;
  public listaMaterias:Array<string>;
  public materiaCheck:Array<string>;
  public alumno:Alumno;
  public passw:string;
  public profesores;
  public dataAlertMaterias:Array<any>;
  fondo;
  boton;
  boton1;
  titulo;
  private logueo:string;

  private storageRef = firebase.storage().ref();

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private camera:Camera, //private dbPersonas:PersonasServiceProvider,
              public alertCtrl:AlertController, private dbAlumnos:AlumnoServiceProvider,
              private dbProfesores:ProfesorServiceProvider,
              private config:ConfigProvider
  ) {}

  ionViewDidLoad() {

    this.datos = this.navParams.data;
    console.log(this.datos);
    this.correo = this.navParams.get('logeo');
    console.log(this.correo);

    this.config.traerEstiloPorCorreo(this.correo).subscribe(res=>{
      console.log(res);
      this.boton=res[0].estiloBtn;
      this.boton1=res[0].estiloBtn1;
      this.fondo=res[0].estiloFondo;
      this.titulo=res[0].estilotitulo;
 
      console.log(this.fondo);
    });

    this.dataAlertMaterias = new Array<any>();
    this.foto="";
    this.listaMaterias = new Array<string>();
    this.dbAlumnos.traerListadoMaterias().subscribe(lista=>{
      this.listaMaterias = lista;
    });
    this.materiaCheck = new Array<string>();
    this.alumno = new Alumno();

    console.log(this.datos.logeo)
  }


  ingresarAlumno(){

    this.alumno.setNombre(this.nombre);
    this.alumno.setLegajo(this.legajo);
    this.alumno.setMateria(this.materiaCheck);
    this.alumno.setFoto(this.foto);
    this.alumno.setPassword(this.passw);
    this.alumno.setCorreo(this.correo);
    console.log('alumno form: ', this.alumno);
    console.log('materias asignadas: ', this.dataAlertMaterias);
    this.dbAlumnos.guardarAlumno(this.alumno, this.dataAlertMaterias);
  }

  marcarOpcion(valor){
    //console.log('event: ', valor);

  }

  sacarFoto(){
    let options:CameraOptions ={
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType:this.camera.EncodingType.JPEG,
      mediaType:this.camera.MediaType.PICTURE,
      targetHeight:600,
      targetWidth:600,
      correctOrientation:true,
      saveToPhotoAlbum:true,
      cameraDirection:this.camera.Direction.BACK
    };

    this.camera.getPicture(options).then((imagen)=>{
          //let imagenData = 'data:image/jpeg;base64,'+ imagen;
          let upload = this.storageRef.child('alumnos/' + this.legajo + '.jpg').putString(imagen, 'base64');

          upload.then((snapshot=>{
              //  this.dbPersonas.guardarLinkFoto(snapshot.downloadURL, this.legajo, 'alumno');
                this.foto=snapshot.downloadURL;
          })
          );
        });
  }

  asignarMaterias(){
    let arrayMateriasAsignadas:Array<any> = new Array<any>();
    let asign = this.alertCtrl.create();
    asign.setTitle("Seleccionar materia");
    this.dbProfesores.traerListadoMaterias().subscribe(materias=>{
      //console.log(materias);
      materias.forEach(mat => {
        let name:string = mat.nombre;
        let aula:string = mat.aula;
        asign.addInput({
          type:'checkbox',
          label:name.toUpperCase() + ' - ' + aula.toUpperCase(),
          value:name + '-' + aula,
          checked:false
        });
      });
    });

    asign.addButton('Cancelar');
    asign.addButton({
      text:'Confirmar',
      handler: data=>{
        this.dataAlertMaterias = data;
      }
    });
    asign.present();

  }

  salir(){

    this.navCtrl.push(LoginPage,{'fondo':this.fondo,'boton':this.boton,'boton1':this.boton1,'titulo':this.titulo});
  }

}
