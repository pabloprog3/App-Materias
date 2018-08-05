import { Component, OnInit, Input } from '@angular/core';
import { File } from "@ionic-native/file";
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { AlumnoServiceProvider } from "../../providers/alumno-service/alumno-service";
import { ProfesorServiceProvider } from "../../providers/profesor-service/profesor-service";
import { AngularFireDatabase } from 'angularfire2/database';
import { GrafAsistAlumnosPage } from '../../pages/graf-asist-alumnos/graf-asist-alumnos';
import { GraficoTodosAlumnosComponent } from '../grafico-todos-alumnos/grafico-todos-alumnos';

@Component({
  selector: 'files',
  templateUrl: 'files.html'
})
export class FilesComponent implements OnInit {

  fileName: string;
  fileContent: string;
  dirName: string;
  dirPath;
  public listaAlumnos:any[];
  public listaMaterias:any[];

  public materiaSelect:string;
  public listadoMaterias:Array<string> = new Array<string>();
  public listadoAlumnos:Array<string> = new Array<string>();
  private data:any={};
  @Input('correo') correo:string;
  private profesor:string;

  constructor(public navCtrl: NavController, public file:File,
              private alumnoDB:AlumnoServiceProvider, private profesorDB:ProfesorServiceProvider,
              public params:NavParams, private db:AngularFireDatabase, public modalCtrl:ModalController,
              public toastCtrl:ToastController

  ) {}

  ngOnInit(){

      //console.log(this.correo);
    this.alumnoDB.getAlumnosLista().subscribe(lista=>{
      this.listaAlumnos = lista;

    });

    this.profesorDB.traerListadoMaterias().subscribe(lista=>{
      this.listaMaterias = lista;

    });

    let listaMaterias:string[] = [];
    this.db.list('/profesores').subscribe(profesores=>{
      profesores.forEach((profesor, i) => {
        //console.log(profesor);
        if (profesor.correo.trim()==this.correo.trim()) {
          //listaMaterias.push(profesor.materias);
          this.listadoMaterias = profesor.materias;
          this.profesor = profesor.nombre;
          this.profesor = this.profesor.trim();
        }
      });
      //console.log(listaMaterias);
      
    });

    this.listadoAlumnos = this.profesorDB.getAlumnosPorProfesor(this.correo, 'matematica');
    //console.log(this.listadoAlumnos);

  }

  writeToFile(fileName,fileContents,dirName) {

        this.fileName = fileName;
        this.fileContent = fileContents;
        this.dirName = dirName;

        console.log ("File Name : " + this.fileName + "FileContent : " + fileContents + "Dir : " + this.dirName);

        let result = this.file.createDir(this.file.dataDirectory, this.dirName, true);

        result.then ( data => {
            this.dirPath = data.toURL();

            alert(" Directorio creado en : " + this.dirPath);

            this.file.writeFile(this.dirPath, this.fileName , this.fileContent , {replace: true });

            alert(" Archivo creado en : " + this.dirPath);

            let fileData = this.file.readAsText(this.dirPath , this.fileName);

            fileData.then(fData => {

                alert("File Data is : " + fData);
            }).catch(error => {
                alert("File read error : " + error);
            });

            //this.copyToLocation("Learning");


        }).catch(error => {
            alert(" Error : " + error );
        });
    }
        copyToLocation(newDirName)

        {
            let result = this.file.createDir(this.file.dataDirectory, newDirName, true);

            result.then ( data => {

                let newPath = data.toURL();

                this.file.copyFile(this.dirPath, this.fileName, newPath, this.fileName );

                alert(" Archivo copiado en : " + newPath);

            }).catch(error => {
                alert(" Error : " + error );
            });
        }


  seleccionarMateria(event){
    let _alumnos:string[] = new Array<string>();
    this.db.list('/alumnos').subscribe(alumnos=>{
      alumnos.forEach(a => {
        if (a.materias!=undefined) {
          let materias:string[] = a.materias;
          materias.forEach(m => {
            let mat:string = m;
            if (mat.trim()==event.trim()) {
              _alumnos.push(a.legajo + '-' + a.nombre);
            }
          });
        }
       
      });
      this.listadoAlumnos = _alumnos;
    });
}
    


  
verAsistencias(alumno:string){
  let legajo:string = alumno.substring(0, alumno.indexOf('-')).trim();
  let nombre:string = alumno.substring(alumno.indexOf('-')+1).trim();
  this.navCtrl.push('VerAsistenciasPage', {legajo:legajo, nombre:nombre, materia:this.materiaSelect.trim(), profesor:this.profesor});
}

verPromedioAlumnos(){
  if (this.materiaSelect == undefined) {
    let toast = this.toastCtrl.create({
      message: 'Seleccione una materia',
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }else{
    //this.data = this.alumnoDB.promedioAlumnosAll(this.materiaSelect.trim());
    let modal = this.modalCtrl.create(GrafAsistAlumnosPage, {materia:this.materiaSelect.trim(), profesor:this.profesor});
    modal.present();
  }

}

}
