import { ToastController, AlertController  } from 'ionic-angular';

export class UtilitiesClass {
  
    _toastCtrl: any;
    _alertCtrl: any;
  
    constructor() 
    {
        this._toastCtrl = ToastController;
        this._alertCtrl = AlertController;
    }

    ionViewDidLoad(){
      this._toastCtrl = ToastController;
      this._alertCtrl = AlertController;
    }
    // FUNCTIONS UTILES
    // PROCESO PARA EL LOGIN DE DE UN USUARIO

  presentToast(message: string) {
    const toast = this._toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  presentAlert(title:string, message: string) {
    let alert = this._alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Aceptar']
    });
    alert.present();
  }


}