import { Component, OnInit } from '@angular/core';

import { ProfesorServiceProvider } from "../../providers/profesor-service/profesor-service";
import { NavController,  ModalController, ViewController,AlertController } from 'ionic-angular';
import { StreamingMedia, StreamingVideoOptions } from "@ionic-native/streaming-media";
//import { ConsultarBajaModifPage } from "../../pages/consultar-baja-modif/consultar-baja-modif";

@Component({
  selector: 'lista-profesores',
  templateUrl: 'lista-profesores.html'
})
export class ListaProfesoresComponent implements OnInit {

  public foto:string;
  public listado:Array<string>;
  public url:string = 'https://firebasestorage.googleapis.com/v0/b/tpfinal-8ff7a.appspot.com/o/ABM_Profesor.mp4?alt=media&token=ae82a3ba-a01c-4319-be7a-c605a98a509d';
  constructor(
                private profesorDB:ProfesorServiceProvider, public modalCtrl:ModalController,
                public view:ViewController, public navCtrl:NavController,
                public media:StreamingMedia, public alertCtrl:AlertController

  ) {}

  ngOnInit(){
    //console.log('component lista-profesores');
    this.foto = '';
    this.profesorDB.getProfesoresLista().subscribe(lista=>{
      this.listado = lista;
    });
  }


  abrirModalView(profesor){
    console.log(profesor);
    let consultaView = this.modalCtrl.create('ConsultarBajaModifPage', {'profesor':profesor});
    consultaView.present();
    //this.navCtrl.push(ConsultarBajaModifPage, {'profesor':profesor});
  }

  public irAFormProfesor(){
    this.navCtrl.push('ProfesoresFormPage');
  }


  playProfesores(){
    /*
    this.videoplayer.play(this.url_asistencia, videoPlayerOptions).then(value=>{
      this.alertCtrl.create({
        title: 'reproducido',
        message: value
      });
    });
    */
    this.alertCtrl.create({
      title:'si'
    })
    let optionsMedia: StreamingVideoOptions = {

      //orientation: 'landscape',
      errorCallback: err=>{
      let alerta = this.alertCtrl.create({
        title:'error: ',
        message: err
      })
      alerta.present();
    },
    successCallback: val=>{
     let alerta = this.alertCtrl.create({
        title:'echo: ',
        message: val
      })
      alerta.present();
    },
      shouldAutoClose: true,
      controls:false
      
      
    }
    this.media.playVideo(this.url, optionsMedia);
  }



}
