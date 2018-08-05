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
import * as XLSX from "xlsx";
//import * as FileSaver from 'file-saver';
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
//import { Asistencia } from '../../clases/asistencia';

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
public alumnosVinieron:Array<string>;
public alumnosFaltaron:Array<string>;

  @Input() correo:string;
  @Input() nombre:string;
  @Input() perfil:string;

  public profesorSelect:string = '';
  public url_asistencia:string = 'https://firebasestorage.googleapis.com/v0/b/tpfinal-8ff7a.appspot.com/o/asistencia.mp4?alt=media&token=e7865b9f-d9ea-4817-bd4d-f7b960427bc7';
  //public url_asistencia:string = 'file:///android_asset/www/assets/videos/asistencia.mp4';
  //public url_asistencia:string = 'file:///android_asset/www/assets/videos/asistencia.mp4';
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private alumnoDB:AlumnoServiceProvider, public modalCtrl:ModalController,
    public file:File, public fileChooser:FileChooser, public filePath:FilePath,
    public alertCtrl:AlertController, public popoverCtrl:PopoverController,
    private profesorDB:ProfesorServiceProvider, public toast:ToastController,
    public camera:Camera, public videoplayer:VideoPlayer, public media:StreamingMedia

  ) {}


  ngOnInit(){
    this.evidencia = '';
    //console.log(this.alumnoDB.getDataAsistencia('android'));
    this.dataMaterias = new Array<any>();
    //console.log(this.profesorSelect);
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

    //console.log(this.dia);
    this.listado = new Array<string>();
    this.listadoProfesores = new Array<string>();

    this.foto="";
    this.alumnoDB.getAlumnosLista().subscribe(lista=>{
      this.listado = lista;
    });
    this.listadoProfesores = this.profesorDB.getProfesoresPorDia();

    //console.log(this.listadoProfesores);
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

  public cargarArchivos(){
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
                        //this.procesarContenidoCSV(texto);
                        let alert = this.alertCtrl.create({
                          title:'texto',
                          message: texto
                        });
                        alert.present();
                    })
              })

            })
          }
      }/*else{
         this.fileChooser.open().then(path=>{
              this.filePath.resolveNativePath(path).then(nativePath=>{
                    this.file.readAsText(this.extraerPath(nativePath), this.extraerNombreArchivo(nativePath)).then(texto=>{

                        this.procesarContenidoCSV(texto);
                    })

              })
          })
      }*/

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

          private setterAlumno(check:boolean, alumno:string):any{
            if (check) {
              alumno = alumno.concat('-', 'asistio: si');
            }else{
              alumno = alumno.concat('-', 'asistio: no');
            }
            return alumno;
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

            /*let aviso = this.toast.create();
            aviso.setPosition('middle');
            aviso.setMessage('Primero, adjunte la foto de la clase.');
            aviso.setDuration(3000);
            aviso.present();
            */
            this.alumnosVinieron = new Array<string>();
            this.alumnosFaltaron = new Array<string>();
            let date:Date = new Date();
            let mes:number = date.getMonth() + 1;
            let diaStr:string = date.getDate() + '/' + mes + '/' + date.getFullYear();
            
            await this.sacarFoto(this.getMesString(mes), date.getDate(), this.getMateriaString(this.getMateriaAsignar(this.profesorSelect)));
   
            let alumnos: Array<string> = this.alumnoDB.getAlumnosTomarAsistencia(this.profesorSelect);
            //console.log(this.alumnoDB.getAlumnosTomarAsistencia(this.profesorSelect));
            //console.log(alumnos);
            let alerta = this.alertCtrl.create();
            alerta.setTitle( 'Tomar asistencia día: ' + diaStr);
            /*alerta.addButton({
              text: 'Ver asistencias',
              handler: val=>{
                //console.log(val);
                this.descargarAsistenciaXLSX();
              }
            });*/
            /*let _alumnos:Array<string> = new Array<string>();
            alumnos.forEach(alumno => {
              _alumnos.push(alumno.concat('-', 'asistio: '));
            });
            */

            let profesor_name:string = this.profesorSelect.substr(0, this.profesorSelect.indexOf('-')).trim().toLowerCase();

            alumnos.forEach((alumno, i) => {
              let _alumno = alumno.concat('-', date.getDate() + '/' + this.getMesString(mes), '-', this.getMateriaAsignar(this.profesorSelect), '-', profesor_name);
              
              console.log(_alumno);

              alerta.addInput({
                type:'checkbox',
                label: alumno,
                value: _alumno,
                checked: false,
                handler: data=>{
                  //console.log(data.checked);
                  if (data.checked) {
                    this.alumnosVinieron.push(_alumno);
                  }else{
                    if (this.alumnosVinieron.includes(alumno)) {
                      let idx:number = this.alumnosVinieron.indexOf(alumno);
                      //console.log(idx);
                      this.alumnosVinieron.splice(idx, 1);
                    }
                  }
                  //console.log(this.alumnosFaltaron);
                  console.log(this.alumnosVinieron);
                }//fin handler
              
              });
              console.log(this)
            });

          alerta.addButton('Cancelar');

          alerta.addButton({
            text:'Confirmar',
            handler: data=>{
              let profesor_name:string = this.profesorSelect.substr(0, this.profesorSelect.indexOf('-')).trim().toLowerCase();
              console.log(profesor_name);
              this.alumnosAsistencia = new Array<string>();
              //this.alumnosAsistencia = data;
              this.alumnosAsistencia = alumnos;

              this.alumnosAsistencia.forEach((alumno, i) => {
                //console.log(alumno);
                alumno = alumno.concat('-', date.getDate() + '/' + this.getMesString(mes), '-', this.getMateriaAsignar(this.profesorSelect), '-', profesor_name);
                console.log(alumno);
                this.alumnosAsistencia[i] = alumno;
              });
              console.log(this.alumnosAsistencia);
              //this.alumnosVinieron = this.alumnosAsistencia;

              this.alumnosAsistencia.forEach(alumno => {
                if (!this.alumnosVinieron.includes(alumno)) {
                  this.alumnosFaltaron.push(alumno);
                }
              });

              //console.log(this.alumnosAsistencia);
              /*this.alumnosAsistencia.forEach((alumno, i) => {
                console.log(alumno);
                
                alumno = alumno.concat('-', date.getDate() + '/' + this.getMesString(mes), '-', this.getMateriaAsignar(this.profesorSelect), '-', profesor_name);
                console.log(alumno);
                this.alumnosAsistencia[i] = alumno;
              });*/
              //console.log(this.alumnosAsistencia);
              this.registrarAsistencia({asistieron:this.alumnosVinieron, faltaron:this.alumnosFaltaron, foto:this.evidencia}, this.getMesString(mes), date.getDate(), this.getMateriaAsignar(this.profesorSelect), profesor_name);
  
            }
            
          });
          alerta.present();

          }

          convertirABlob(s){
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
          }
        
          async descargarAsistenciaXLSX(){
            //console.log(this.alumnoDB.getDataAsistencia('android'));
            let data = this.alumnoDB.getDataAsistencia('android');
            //console.log(data);
            let hoja:XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
            //alert(JSON.stringify(hoja));
            const libro:XLSX.WorkBook = {
              Sheets:{
                'asistencias':hoja
              },
              SheetNames: ['asistencias']
              
            };
            //alert(JSON.stringify(libro));
            let wbout:ArrayBuffer = XLSX.write(libro, {
              bookType:'xlsx',
              type:'array'
              
            });
            //const excelBuffer: any = XLSX.write(wbout, { bookType: 'xlsx', type: 'buffer' });
            //this.saveAsExcelFile(excelBuffer, 'asistencias_julio')
            const blob = new Blob([wbout], { type: 'application/octet-stream'});
            const target:string = this.file.externalDataDirectory
            const dentry = await this.file.resolveDirectoryUrl(target);
            const url:string = dentry.nativeURL;
            await this.file.writeFile(url, 'asistencias.xlsx', blob, {replace:true});
            /*
            this.getStoragePath().then(url=>{
              this.file.writeFile(url, "asistencias_julio.xlsx", blob);
            });*/
            /*const blob = new Blob([this.convertirABlob(wbout)], { type: 'application/octet-stream'});
            this.getStoragePath().then(url=>{
              this.file.writeFile(url, 'asistencias.xlsx', blob, {replace:true});
            });*/
          }

          saveAsExcelFile(buffer:any, fileName:string){
            const data: Blob = new Blob([buffer], {
              type: 'xlsx'
            });
           // FileSaver.saveAs(data, fileName + '.xlsx');
          }

          getStoragePath(){
            let file = this.file;
            return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function(directoryEntry){
              return file.getDirectory(directoryEntry, "export_materias",{
                create: true,
                exclusive:false
              }).then(function(){
                return directoryEntry.nativeURL + "export_materias/";
              });
            });
          }
          
          private registrarAsistencia(alumnos:any, mes:string, dia:number, materia:string, profesor:string):void{
              this.alumnoDB.setAsistencia(alumnos, mes, dia, materia, profesor);
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



        playAsistencia(){
        
          let optionsMedia: StreamingVideoOptions = {

            //orientation: 'landscape',
            shouldAutoClose: true,
            controls:false
            
            
          }
          this.media.playVideo(this.url_asistencia, optionsMedia);
        }

}// fin clase
