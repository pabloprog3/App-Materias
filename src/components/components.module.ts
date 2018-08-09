import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LectorQrComponent } from './lector-qr/lector-qr';
import { IonicModule, IonicPageModule } from "ionic-angular";
import { PerfilComponent } from './perfil/perfil';
import { ListaProfesoresComponent } from './lista-profesores/lista-profesores';
import { ListaAlumnosComponent } from './lista-alumnos/lista-alumnos';
import { FilesComponent } from './files/files';
import { TutorialComponent } from './tutorial/tutorial';
import { GraficoTodosAlumnosComponent } from './grafico-todos-alumnos/grafico-todos-alumnos';
@NgModule({
	declarations: [
    LectorQrComponent,
    PerfilComponent,
    ListaProfesoresComponent,
    ListaAlumnosComponent,
    FilesComponent,
    TutorialComponent,
    GraficoTodosAlumnosComponent
  ],
	imports: [
    IonicModule
  ],
  exports: [
    LectorQrComponent,
    PerfilComponent,
    ListaProfesoresComponent,
    ListaAlumnosComponent,
    FilesComponent,
    TutorialComponent,
    GraficoTodosAlumnosComponent

  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class ComponentsModule {}
