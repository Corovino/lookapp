import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { EditPerfilPage } from '../edit-perfil/edit-perfil';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public rest: ServicesProvider,
    public storate: Storage,
    public camera: Camera,
    public alertCtrl: AlertController) {
  }
  info_user: any;
  iduser: number;

  ionViewDidLoad() {
    this.storate.get('xx-app-loap').then((loap: any) => {
        let user = JSON.parse(loap);
        this.iduser = user.data.user._id;
        this.rest.get_info_user(user.data.user._id).subscribe((response:any) => {
          
          this.info_user = response.data;
          this.info_user.img == null ? this.info_user.img = "assets/imgs/icon.png" : this.info_user.img;

        })
    })
  }

  ionViewCanEnter(){
    console.log("ionViewVillEnter ciclo one");
  }

  // ionViewDidLoad(){
  //   console.log("ioncViewDidLoad ciclco dos")
  // }

  edit_perfil(){
      this.navCtrl.push(EditPerfilPage, {data: this.info_user});
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



    
  presentAlert(title:string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Aceptar']
    });
    alert.present();
  }

}

