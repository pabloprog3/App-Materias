import { Component, OnInit, Input } from '@angular/core';

import { IonicPage, NavController, NavParams, ModalController, ModalOptions, AlertController, PopoverController } from 'ionic-angular';

import { AlumnoServiceProvider } from "../../providers/alumno-service/alumno-service";
import { ProfesorServiceProvider } from "../../providers/profesor-service/profesor-service";

import { File,FileEntry } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path";
import { FileChooser } from "@ionic-native/file-chooser";

import { Alumno } from "../../clases/alumno";

import { ConsultarBajaModifPage } from "../../pages/consultar-baja-modif/consultar-baja-modif";


@Component({
  selector: 'lista-alumnos',
  templateUrl: 'lista-alumnos.html'
})
export class ListaAlumnosComponent implements OnInit {

  public foto:string;
public  listado:Array<string>;
public  listadoProfesores:Array<string>;
public  date:number = new Date().getDay();
public  dia:string = '';

  @Input() correo:string;
  @Input() nombre:string;
  @Input() perfil:string;

  public profesorSelect:string = '';

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private alumnoDB:AlumnoServiceProvider, public modalCtrl:ModalController,
    public file:File, public fileChooser:FileChooser, public filePath:FilePath,
    public alertCtrl:AlertController, public popoverCtrl:PopoverController,
    private profesorDB:ProfesorServiceProvider

  ) {}


  ngOnInit(){
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
      console.log('lista alumnos: ', this.listado);
    });
    this.listadoProfesores = this.profesorDB.getProfesoresPorDia();

    console.log(this.listadoProfesores);
    console.log(this.correo);
    console.log(this.nombre);
    console.log(this.perfil);
  }


  abrirModalView(alumno){
    console.log(alumno);
    let consultaView = this.modalCtrl.create('ConsultarBajaModifPage', {'alumno':alumno});
    console.log(alumno);
    consultaView.present();
    //this.navCtrl.push(ConsultarBajaModifPage, {'alumno':alumno});
  }

  addNuevoAlumno(){
    this.navCtrl.push('AlumnosFormPage');
  }


  seleccionarProfesor(value){
    console.log(value);
    console.log(this.profesorSelect);
    console.log(this.devolverMateria());
  }

  private cargarArchivos(){
      if (this.perfil=='administrador' || this.perfil=='administrativo') {
          if (this.profesorSelect == '') {
            let alerta = this.alertCtrl.create({
                title:'Error',
                message: 'Seleccione un profesor y materia para cargar el listado'
            });
            alerta.present();

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
                          let materia:Array<string> = new Array<string>();
                          materia.push(this.devolverMateria().trim());
                          alumno.setNombre(campoNombre);
                          alumno.setLegajo(campoLegajo);
                          alumno.setHorario(campoHorario);
                          alumno.setPerfil('alumno');
                          alumno.setMateria(materia);

                          this.alumnoDB.guardarAlumno(alumno);

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

}
