import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, AngularFireDatabaseModule } from 'angularfire2/database';
import { Estilo } from "../../clases/estilo";

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  private listaEstilo:FirebaseListObservable<any[]>;

  constructor(public http: Http,
    private db:AngularFireDatabase) {
    console.log('Hello ConfigProvider Provider');
  }

  public traerEstiloPorCorreo(correo:string):FirebaseListObservable<any[]>{
    this.listaEstilo = this.db.list('/estilo', {
      query:{
        orderByChild:'correo',
        equalTo:correo
      }
    }) as FirebaseListObservable<any[]>
    return this.listaEstilo;
  }

  public guardarEstilo(estilo:Estilo){
    this.db.app.database().ref('/estilo/'+this.truncateCorreo(estilo.getCorreo())).set(estilo);
  }

  private truncateCorreo(_correo:string):string{
    let truncado:string = '';
    //truncado = _correo.replace('.','');
    for (let i = 0; i < _correo.length; i++) {
      if (_correo[i] == '.') {
        truncado += _correo[i].replace('.', '');
      }else{
        truncado += _correo[i];
      }
    }
    console.log(truncado);
    return truncado;
  }

}
