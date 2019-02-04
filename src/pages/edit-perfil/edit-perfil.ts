import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ServicesProvider } from '../../providers/services/services';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  public iduser: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public rest: ServicesProvider,
    public alertCtrl: AlertController,
    public camera: Camera

  ) {
    this.info_user = this.navParams.data.data;

    this.storage.get('xx-app-loap').then( (loap: any) => {
      let user = JSON.parse(loap);
      this.iduser = user.data.user._id;
    })
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPerfilPage');
  }
  
  updateDate() {
    this.rest.update_user(this.info_user, this.iduser).subscribe( (resp:any) => {
        if(resp.error) {
          this.presentAlert("", resp.message)
        } else {
          this.presentAlert("", "Se ha actualizado de forma correcta"); 
        }
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


    
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }


  image: any = 'assets/imgs/icon.png';
  file: any = false;
  userForm: any = new FormData();
  getPicture(){
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetHeight: 500,
      targetWidth: 500,
      quality: 100,
      allowEdit: true,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options)
      .then(data => {
        this.image = `data:image/jpeg;base64,${data}`;
        //Usage example:
        this.file = this.dataURLtoFile(`data:image/jpeg;base64,${data}`, 'a.png');
        this.userForm.delete('img');
        this.userForm.append('img', this.file);
      }).catch(e => {
        console.error(e)
      })
  }

  save_img(){

    this.rest.save_img_user(this.userForm, this.iduser).subscribe( (data:any) => {    
        if(data.error == true){
            this.presentAlert("Alert", "La imagen no ha podido ser subida por favor intente de nuevo");
        } else {
          this.image = data.data.img;
          
        }
    })
  }

}
