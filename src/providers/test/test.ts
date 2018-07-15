import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, AngularFireDatabaseModule } from 'angularfire2/database';
import { Estilo } from "../../clases/estilo";

@Injectable()
export class TestProvider {

  private listaEstilo:FirebaseListObservable<any[]>;

  constructor(private db:AngularFireDatabase) {
    
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
    truncado = _correo.replace('.','');
    console.log(truncado);
    return truncado;
  }

}
