import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ServicesProvider } from '../../providers/services/services';

/**
 * Generated class for the EditPerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-perfil',
  templateUrl: 'edit-perfil.html',
})
export class EditPerfilPage {

  public info_user: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public rest: ServicesProvider,
    public alertCtrl: AlertController

  ) {
    this.info_user = this.navParams.data.data;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPerfilPage');
  }

  updateDate() {
    
    this.storage.get('xx-app-loap').then( (loap: any) => {
        let user = JSON.parse(loap);

        this.rest.update_user(this.info_user, user.data.user._id).subscribe( (resp:any) => {
            if(resp.error) {
              this.presentAlert("", resp.message)
            } else {
              this.presentAlert("", "Se ha actualizado de forma correcta"); 
            }
        })
    })
  }


  presentAlert(title:string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Aceptar']
    });
    alert.present();
  }




}
