import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { EditPerfilPage } from '../edit-perfil/edit-perfil';
import { Message_rpt } from '../../clases/letters';
import { RepoProvider } from '../../providers/repo/repo';

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

  rootPage:any = 'ionic-pipes-home';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public rest: ServicesProvider,
    public storate: Storage,
    public camera: Camera,
    public repo: RepoProvider) {
  }
  info_user: any;
  iduser: number;

  

  ionViewDidLoad() {
    this.storate.get('xx-app-loap').then((loap: any) => {
        let user = JSON.parse(loap);
        this.iduser = user.data.user._id;
        this.getInfo(this.iduser);
    })
  }


  getInfo(id){
    this.rest.get_info_user(id).subscribe((response:any) => {
      this.info_user = response.data;
      this.info_user.img == null ? this.info_user.img = "assets/imgs/icon.png" : this.info_user.img;
    })
  }


  
  doRefresh(element){
    
    this.getInfo(this.iduser)
    setTimeout(() => {
      element.complete();
    }, 1000);
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
          this.repo.presentAlert("La imagen no ha podido ser subida por favor intente de nuevo", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      } else {
        this.image = data.data.img;
        
      }
  })
}


}

