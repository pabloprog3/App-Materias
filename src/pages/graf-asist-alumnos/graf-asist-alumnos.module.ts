import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrafAsistAlumnosPage } from './graf-asist-alumnos';
import { ChartsModule } from "ng2-charts";

@NgModule({
  declarations: [
    GrafAsistAlumnosPage,
  ],
  imports: [
    IonicPageModule.forChild(GrafAsistAlumnosPage),
    ChartsModule
  ],
})
export class GrafAsistAlumnosPageModule {}
