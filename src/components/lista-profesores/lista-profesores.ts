import { Component, OnInit } from '@angular/core';

import { ProfesorServiceProvider } from "../../providers/profesor-service/profesor-service";
import { NavController,  ModalController, ViewController,AlertController } from 'ionic-angular';
import { StreamingMedia, StreamingVideoOptions } from "@ionic-native/streaming-media";
import { VideoOptions, VideoPlayer } from '@ionic-native/video-player';

//import { ConsultarBajaModifPage } from "../../pages/consultar-baja-modif/consultar-baja-modif";

@Component({
  selector: 'lista-profesores',
  templateUrl: 'lista-profesores.html'
})
export class ListaProfesoresComponent implements OnInit {
  videoOpts:VideoOptions
  public foto:string;
  public listado:Array<string>;
  public url:string = 'https://firebasestorage.googleapis.com/v0/b/tpfinal-8ff7a.appspot.com/o/ABM_Profesor.mp4?alt=media&token=ae82a3ba-a01c-4319-be7a-c605a98a509d';
  constructor(
                private profesorDB:ProfesorServiceProvider, public modalCtrl:ModalController,
                public view:ViewController, public navCtrl:NavController,
                public media:StreamingMedia, public alertCtrl:AlertController, public videoPlayer:VideoPlayer

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

    this.videoOpts = {volume:1.0};
    this.videoPlayer.play('file:///android_asset/www/assets/ABM_Profesor.mp4', this.videoOpts).then((val)=>{
      let alerta = this.alertCtrl.create({
        title:'Finalizo el tutorial'
      });
      alerta.present();
    });
  }

  }
