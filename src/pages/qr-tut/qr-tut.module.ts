import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrTutPage } from './qr-tut';

@NgModule({
  declarations: [
    QrTutPage,
  ],
  imports: [
    IonicPageModule.forChild(QrTutPage),
  ],
})
export class QrTutPageModule {}
