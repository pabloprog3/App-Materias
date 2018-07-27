import { Component, OnInit, Input } from '@angular/core';
import { File } from "@ionic-native/file";
import { NavController, NavParams } from 'ionic-angular';
import { AlumnoServiceProvider } from "../../providers/alumno-service/alumno-service";
import { ProfesorServiceProvider } from "../../providers/profesor-service/profesor-service";
import { AngularFireDatabase } from 'angularfire2/database';

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
  @Input('correo') correo:string;

  constructor(public navCtrl: NavController, public file:File,
              private alumnoDB:AlumnoServiceProvider, private profesorDB:ProfesorServiceProvider,
              public params:NavParams, private db:AngularFireDatabase

  ) {}

  ngOnInit(){
      console.log(this.correo);
    this.alumnoDB.getAlumnosLista().subscribe(lista=>{
      this.listaAlumnos = lista;
      console.log(this.listaAlumnos);
    });

    this.profesorDB.traerListadoMaterias().subscribe(lista=>{
      this.listaMaterias = lista;
      console.log(this.listaMaterias);
    });

    this.listadoMaterias = this.profesorDB.getMateriasDelProfesor(this.correo); 
    console.log(this.listadoMaterias);

    this.listadoAlumnos = this.profesorDB.getAlumnosPorProfesor(this.correo, 'matematica');
    console.log(this.listadoAlumnos);

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
            //console.log(event);
            //this.listadoAlumnos = this.profesorDB.getAlumnosPorProfesor(this.correo, event);
            //console.log(this.listadoAlumnos);
            let _alumnos:string[] = new Array<string>();
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
            console.log(event);
            if (mat.trim()==event.trim()) {
              console.log('son iguales');
              _alumnos.push(a.legajo + '-' + a.nombre);
              //console.log(a.nombre);
              //this.listaAlumnosPorProfesor.push(a.nombre);
            }
          });
        }
       
      });
      console.log(_alumnos);
      this.listadoAlumnos = _alumnos;
      console.log(this.listadoAlumnos);
    });
}
    

}
