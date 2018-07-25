import { Component, OnInit, Input } from '@angular/core';

import {  NavController, NavParams, ModalController, AlertController, 
         PopoverController, ToastController } from 'ionic-angular';

import { AlumnoServiceProvider } from "../../providers/alumno-service/alumno-service";
import { ProfesorServiceProvider } from "../../providers/profesor-service/profesor-service";

import { File } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path";
import { FileChooser } from "@ionic-native/file-chooser";

import { Alumno } from "../../clases/alumno";

import { Camera, CameraOptions } from "@ionic-native/camera";

import * as firebase from 'firebase';

@Component({
  selector: 'lista-alumnos',
  templateUrl: 'lista-alumnos.html'
})
export class ListaAlumnosComponent implements OnInit {

public foto:string;
public  listado:Array<string>;
public dataMaterias:Array<any>;
public  listadoProfesores:Array<string>;
public  date:number = new Date().getDay();
public  dia:string = '';
public alumnosAsistencia:Array<string>;
public evidencia:string = undefined;
private storageRef = firebase.storage().ref();

  @Input() correo:string;
  @Input() nombre:string;
  @Input() perfil:string;

  public profesorSelect:string = '';

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private alumnoDB:AlumnoServiceProvider, public modalCtrl:ModalController,
    public file:File, public fileChooser:FileChooser, public filePath:FilePath,
    public alertCtrl:AlertController, public popoverCtrl:PopoverController,
    private profesorDB:ProfesorServiceProvider, public toast:ToastController,
    public camera:Camera

  ) {}


  ngOnInit(){
    console.log(this.alumnoDB.getDataAsistencia('programacion web'));
    this.dataMaterias = new Array<any>();
    console.log(this.profesorSelect);
    switch (this.date) {
      case 1:
          this.dia = 'Lunes';
      break;
      case 2:
          this.dia = 'Martes';
      break;
      case 3:
          this.dia = 'Miércoles';
      break;
      case 4:
          this.dia = 'Jueves';
      break;
      case 5:
          this.dia = 'Viernes';
      break;
      case 6:
          this.dia = 'Sábado';
      break;
      case 7:
          this.dia = 'Domingo';
      break;

      default:
      break;
    }

    console.log(this.dia);
    this.listado = new Array<string>();
    this.listadoProfesores = new Array<string>();

    this.foto="";
    this.alumnoDB.getAlumnosLista().subscribe(lista=>{
      this.listado = lista;
    });
    this.listadoProfesores = this.profesorDB.getProfesoresPorDia();

    console.log(this.listadoProfesores);
  }


  abrirModalView(alumno){
    let consultaView = this.modalCtrl.create('ConsultarBajaModifPage', {'alumno':alumno});
    consultaView.present();
  }

  addNuevoAlumno(){
    this.navCtrl.push('AlumnosFormPage');
  }


  seleccionarProfesor(value){

  }

  private cargarArchivos(){
    if (this.profesorSelect=='') {
      let toast = this.toast.create({
        message: 'Necesita seleccionar un profesor antes de continuar',
        duration: 1000,
        position: 'middle'
      });
      toast.present();
    }
      if (this.perfil=='administrador' || this.perfil=='administrativo') {
          if (this.profesorSelect == '') {
          }else {
            this.fileChooser.open().then(path=>{
              this.filePath.resolveNativePath(path).then(nativePath=>{
                    this.file.readAsText(this.extraerPath(nativePath), this.extraerNombreArchivo(nativePath)).then(texto=>{
                        this.procesarContenidoCSV(texto);
                    })
              })

            })
          }
      }else{
         this.fileChooser.open().then(path=>{
              this.filePath.resolveNativePath(path).then(nativePath=>{
                    this.file.readAsText(this.extraerPath(nativePath), this.extraerNombreArchivo(nativePath)).then(texto=>{

                        this.procesarContenidoCSV(texto);
                    })

              })
          })
      }

  }

      private procesarContenidoCSV(_texto:string){
              let campoLegajo:string='';
              let campoNombre:string='';
              let campoHorario:string='';

              //let arrayListado:Array<string> = new Array<string>();

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
                          let materia:Array<string> = new Array<string>();
                          materia.push(this.getMateriaAsignar(this.profesorSelect));
                          alumno.setNombre(campoNombre);
                          alumno.setLegajo(campoLegajo);
                          alumno.setHorario(campoHorario);
                          alumno.setPerfil('alumno');
                          alumno.setMateria(materia);
                          this.dataMaterias.push(campoNombre + '-' + this.getMateriaAsignar(this.profesorSelect));
                          this.alumnoDB.guardarAlumno(alumno, this.dataMaterias);

                          cont = 0;
                          campoLegajo = '';
                          campoNombre='';
                          campoHorario='';
                      break;
                    }//fin switch
                  }//fin if
                }//fin for
                //this.navCtrl.pop();
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

          private extraerTipoFile(_path:string):string{
            let ext:string="";

            let puntoIDX:number = _path.lastIndexOf('.');
            ext=_path.substring(puntoIDX);

            return ext;
          }


          private devolverMateria(){
            let profesorSelectArray = this.profesorSelect.split(":");
            let materiaSelectIdx:number =profesorSelectArray.length - 1;
            let materiaSelectStr:string = profesorSelectArray[materiaSelectIdx];

            return materiaSelectStr;
          }


          private getMateriaAsignar(info:string):string{
            let materia:string = info.substring(info.indexOf('-')+1);
            //console.log(materia);
            return materia.toLowerCase().trim();
          }

          async tomarAsistencia(){
            if (this.profesorSelect=='') {
             let msjToast =  this.toast.create();
             msjToast.setMessage("Debe seleccionar un profesor");
             msjToast.setDuration(1000);
             msjToast.setPosition("middle");
             msjToast.present();
             return;
            }

            let aviso = this.toast.create();
            aviso.setPosition('middle');
            aviso.setMessage('Primero, adjunte la foto de la clase.');
            aviso.setDuration(3000);
            aviso.present();
            
            let date:Date = new Date();
            let mes:number = date.getMonth() + 1;
            let diaStr:string = date.getDate() + '/' + mes + '/' + date.getFullYear();
            
            await this.sacarFoto(this.getMesString(mes), date.getDate(), this.getMateriaString(this.getMateriaAsignar(this.profesorSelect)));
   
            let alumnos: Array<string> = this.alumnoDB.getAlumnosTomarAsistencia(this.profesorSelect);
            let alerta = this.alertCtrl.create();
            alerta.setTitle( 'Tomar asistencia día: ' + diaStr);
            
            alumnos.forEach(alumno => {
              alerta.addInput({
                type:'checkbox',
                label: alumno,
                value: alumno,
                checked: false
              });
            });

          alerta.addButton('Cancelar');

          alerta.addButton({
            text:'Confirmar',
            handler: data=>{
              this.alumnosAsistencia = new Array<string>();
              this.alumnosAsistencia = data;
              console.log(this.alumnosAsistencia);
              this.registrarAsistencia({data:data, foto:this.evidencia}, this.getMesString(mes), date.getDate(), this.getMateriaAsignar(this.profesorSelect));
  
            }
          });
          alerta.present();

          }

        
          
          private registrarAsistencia(alumnos:any, mes:string, dia:number, materia:string):void{
              this.alumnoDB.setAsistencia(alumnos, mes, dia, materia);
          }

          private  sacarFoto(mes:string, dia:number, materia:string){
            //let more:number = this.cont + 1;
            let options:CameraOptions ={
              quality: 50,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType:this.camera.EncodingType.JPEG,
              mediaType:this.camera.MediaType.PICTURE,
              correctOrientation:false,
              saveToPhotoAlbum:true,
              cameraDirection:this.camera.Direction.BACK
            };
      
            this.camera.getPicture(options).then((imagen)=>{
              let imagenData = 'data:image/jpeg;base64,'+ imagen;
              let upload = this.storageRef.child('asistencia/' + materia + '/'+mes+'/'+ dia + '_evidencia.jpg').putString(imagen, 'base64');
      
                  upload.then((snapshot=>{
                        //let objJson = {'foto':snapshot.downloadURL, 'activa':false}
                        //let arr:Array<string>=new Array<string>();
                        this.evidencia = snapshot.downloadURL;
                        //this.fotos.push(JSON.parse(JSON.stringify(objJson)));
                        //this.dbPersonas.guardarLinkFoto(snapshot.downloadURL, this.legajo, this.perfil, this.fotos);
      
                      })
                  );
            });
      
          }

          private getMesString(mes:number):string{
            let mesStr:string = '';
            switch (mes) {
              case 1:
                    mesStr = 'Enero'
              break;
              case 2:
                    mesStr = 'Febrero'
              break;
              case 3:
                    mesStr = 'Marzo'
              break;
              case 4:
                    mesStr = 'Abril'
              break;
              case 5:
                    mesStr = 'Mayo'
              break;
              case 6:
                    mesStr = 'Junio'
              break;
              case 7:
                    mesStr = 'Julio'
              break;
              case 8:
                    mesStr = 'Agosto'
              break;
              case 9:
                    mesStr = 'Septiembre'
              break;
              case 10:
                    mesStr = 'Octubre'
              break;
              case 11:
                    mesStr = 'Noviembre'
              break;
              case 12:
                    mesStr = 'Diciembre'
              break;
            
              default:
                break;
            }
            return mesStr.toLowerCase();
          }


        private getMateriaString(profesor:string):string{
          let materia:string = '';
          return materia.substring(profesor.indexOf('-')+1);
        }


}// fin clase
