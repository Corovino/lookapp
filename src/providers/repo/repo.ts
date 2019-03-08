import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';

/*
  Generated class for the RepoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RepoProvider {

  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastController: ToastController
    ) {

  }

  // START MESSAGE TO LOADING
  loding: any;
  startMessage(msm: string) {
    this.loding = this.loadingCtrl.create({
      content: msm,
      spinner: 'crescent',
    });

    this.loding.present();  
  }

  // STOP MESSAGE TO LOADING
  stopMessage(){
    this.loding.dismiss() ;
  }

  // PRESENT ALERT WITH STYLES
  
  // Alert
  presentAlert(message: string, buttons: Array<any>, btnClass: string ) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: buttons,
      cssClass: btnClass
    });
    alert.present();
  }

  // TOASTER
  
  presentToast(msm) {
    const toast = this.toastController.create({
      message: msm,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }



}
