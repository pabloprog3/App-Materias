import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { AlumnoServiceProvider } from '../../providers/alumno-service/alumno-service';
import { Alumno } from '../../clases/alumno';
import { ProfesorServiceProvider } from "../../providers/profesor-service/profesor-service";

@IonicPage()
@Component({
  selector: 'page-datos-alumnos',
  templateUrl: 'datos-alumnos.html',
})
export class DatosAlumnosPage {

  public alumno:any;
  public mostrarDatos:boolean;
  public nombre:string;
  public legajo:string;
  public correo:string;
  public foto:string;
  public listaMaterias:Array<string>;
  public dataAlertMaterias:Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alumnoDB:AlumnoServiceProvider, public view:ViewController,
              public alertCtrl:AlertController, private dbProfesores:ProfesorServiceProvider
              

  ) {}

  ionViewDidLoad() {
    this.listaMaterias = new Array<string>();
    this.dataAlertMaterias = new Array<any>();
    this.alumno = this.navParams.get('alumno');
    this.mostrarDatos = this.navParams.get('boolDatos');
    console.log('nombre: ', this.alumno.nombre);
    this.nombre = this.alumno.nombre;
    this.legajo = this.alumno.legajo;
    this.correo = this.alumno.correo;
    this.foto = this.alumno.foto;
    this.alumnoDB.traerListadoMateriasPorAlumno(this.legajo).subscribe(lista=>{
      this.listaMaterias = lista;
      console.log('this.listaMaterias', this.listaMaterias);
    })
  }


  cancelarOpe(){
    this.view.dismiss();
  }

  eliminarAlumno(){
    
    this.alumnoDB.borrarAlumno(this.legajo);

    this.view.dismiss();
  }

  modificarAlumno(){
    let alumno:Alumno=new Alumno();
    let materia:Array<string> = new Array<string>();

    materia = this.getMateriaAsignar(this.dataAlertMaterias);
    alumno.setMateria(materia);
    alumno.setLegajo(this.legajo);
    alumno.setCorreo(this.correo);
    alumno.setNombre(this.nombre);
    if (this.foto != undefined) {
      alumno.setFoto(this.foto);
    }
    
    this.alumnoDB.modificarAlumno(alumno);

    this.view.dismiss();
  }

  private getMateriaAsignar(info:Array<any>):Array<string>{
    let materia:Array<string> = new Array<string>();
    info.forEach(inf => {
      console.log(inf);
      let _inf:string = inf;
      let _materia:string = _inf.substring(0, _inf.indexOf('-')).trim();
      materia.push(_materia.toLowerCase());
    });
    return materia;

  }

  asignarMaterias(){
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

}
