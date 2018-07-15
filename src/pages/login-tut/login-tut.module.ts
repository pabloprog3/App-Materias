import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginTutPage } from './login-tut';

@NgModule({
  declarations: [
    LoginTutPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginTutPage),
  ],
})
export class LoginTutPageModule {}
