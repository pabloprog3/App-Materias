import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,LoadingController } from 'ionic-angular';
import { Usuario } from "../../clases/usuario";
import { ListadoAlumnosPage } from "../../pages/listado-alumnos/listado-alumnos";
import { AlumnoServiceProvider } from "../../providers/alumno-service/alumno-service";
import { EncuestasHomePage } from "../../pages/encuestas-home/encuestas-home";
import { File } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path";
import { FileChooser } from "@ionic-native/file-chooser";
//import { FileOpener } from "@ionic-native/file-opener";
import { Alumno } from "../../clases/alumno";
import {LoginPage} from '../../pages/login/login';

import { ProfesorServiceProvider } from "../../providers/profesor-service/profesor-service";
import { ConfigProvider } from "../../providers/config/config";

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  public datos:any;
  public perfil:string='';
  public segmentAlumno:string = 'tutorial';
  public segment:string;
  fondo;
  boton;
  boton1;
  titulo;
  public logueo:string;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl:AlertController,public loadingCtrl:LoadingController,

              public file:File, public filePath:FilePath, public fileChooser:FileChooser,
              private alumnoDB:AlumnoServiceProvider, private profesorDB:ProfesorServiceProvider,
              private config:ConfigProvider

  ) { }

  ionViewWillEnter(){
    this.datos = this.navParams.data;
    console.log(this.datos);
    this.perfil = this.datos['perfil'];
    console.log(this.perfil);
    console.log(this.datos['correo']);
    }

  ionViewDidLoad() {

    this.datos = JSON.parse(this.navParams.data);
    console.log(this.datos);
    this.perfil = this.datos["perfil"];
    let correo =  this.datos["correo"];
    console.log(correo);
   this.config.traerEstiloPorCorreo(correo).subscribe(res=>{
     console.log(res);
     this.boton=res[0].estiloBtn;
     this.boton1=res[0].estiloBtn1;
     this.fondo=res[0].estiloFondo;
     this.titulo=res[0].estilotitulo;

     console.log(this.fondo);
   })

    //console.log(this.perfil);
    //console.log(this.profesorDB.getProfesoresPorDia());
  }



  private irAFormAlumnos(){
    this.navCtrl.push("AlumnosFormPage");
  }


  private irAFormProfesores(){
    this.navCtrl.push("ProfesoresFormPage");
  }

  private irABMProfesores(){

    this.navCtrl.push("ListaProfesoresPage");
  }

  private irAListaAlumnos(){
    this.navCtrl.push('ListadoAlumnosPage');
  }

  irABMPEncuestas()
  {
    const loading = this.loadingCtrl.create({
      content: 'Ingresando. Espere...',
      dismissOnPageChange: true,
      spinner:"bubbles"
    });
    loading.present();
    this.navCtrl.push('EncuestasHomePage');

  }

  private cargarArchivos(){

    this.fileChooser.open().then(path=>{
      this.filePath.resolveNativePath(path).then(nativePath=>{

        this.file.readAsText(this.extraerPath(nativePath), this.extraerNombreArchivo(nativePath)).then(texto=>{
          let msg = this.alertCtrl.create({
            title:'texto',
            message:texto
          });
          msg.present();
          this.procesarContenidoCSV(texto);

        });

      });

    });
  }

  private procesarContenidoCSV(_texto:string){
      let campoLegajo:string='';
      let campoNombre:string='';
      let campoHorario:string='';

      let arrayListado:Array<string> = new Array<string>();

      let cont:number = 0;

        for (var i = 0; i < _texto.length; i++) {

          if ((_texto[i]==';') || (_texto[i]=='\n' && cont==2)) {
            cont += 1;
          }

          if (_texto[i]!=';') {
            switch (cont) {
              case 0:
                      campoLegajo += _texto[i];
              break;
              case 1:
                      campoNombre += _texto[i];
              break;
              case 2:
                      campoHorario += _texto[i];

              break;
              case 3:
                  let alumno:Alumno = new Alumno();
                  alumno.setNombre(campoNombre);
                  alumno.setLegajo(campoLegajo);
                  alumno.setHorario(campoHorario);
                  alumno.setPerfil('alumno');
                  this.alumnoDB.guardarAlumno(alumno);

                  cont = 0;
                  campoLegajo = '';
                  campoNombre='';
                  campoHorario='';
              break;
            }//fin switch
          }//fin if
        }//fin for
  }

  private extraerPath(_path:string):string{
    let path:string='';
    let barraIDX:number = _path.lastIndexOf('/');
    path = _path.substring(0,barraIDX);
    path += '/';

    return path;
  }

  private extraerNombreArchivo(_path:string):string{
    let nombre:string='';
    let barraIDX:number = _path.lastIndexOf('/');
    nombre= _path.substring(barraIDX + 1);

    return nombre;
  }


  segmentChanged(event){
    //console.log(event.value);

  }

  salir(){

    this.navCtrl.push(LoginPage,{'fondo':this.fondo,'boton':this.boton,'boton1':this.boton1,'titulo':this.titulo});
  }

}
