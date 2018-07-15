import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrAdminTutPage } from './qr-admin-tut';

@NgModule({
  declarations: [
    QrAdminTutPage,
  ],
  imports: [
    IonicPageModule.forChild(QrAdminTutPage),
  ],
})
export class QrAdminTutPageModule {}
