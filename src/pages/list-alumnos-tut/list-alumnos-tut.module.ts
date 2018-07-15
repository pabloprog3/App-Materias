import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListAlumnosTutPage } from './list-alumnos-tut';

@NgModule({
  declarations: [
    ListAlumnosTutPage,
  ],
  imports: [
    IonicPageModule.forChild(ListAlumnosTutPage),
  ],
})
export class ListAlumnosTutPageModule {}
