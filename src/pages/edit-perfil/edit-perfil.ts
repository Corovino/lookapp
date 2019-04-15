import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ServicesProvider } from '../../providers/services/services';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RepoProvider } from '../../providers/repo/repo';
import { Message_rpt } from '../../clases/letters';

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
  
  public info_user: any = {name: '', lname: '', phone: '', cedula: '', email: ''};
  public iduser: any;

  
  public image: any = 'assets/imgs/icon.png';
  public file: any = false;
  public userForm: any = new FormData();
  public avialableToUpdate : boolean = false;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public rest: ServicesProvider,
    public camera: Camera,
    public repo: RepoProvider

  ) {

    this.info_user = this.navParams.data.data;

    this.image = this.info_user.img;

    this.storage.get('xx-app-loap').then( (loap: any) => {
      let user = JSON.parse(loap);
      this.iduser = user.data.user._id;
    })
  
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPerfilPage');
  }
  
    
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }



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
        this.info_user.img = this.dataURLtoFile(`data:image/jpeg;base64,${data}`, 'a.png');
        this.userForm.delete('img');
        this.userForm.append('img', this.info_user.img);
        this.avialableToUpdate = true;

      }).catch(e => {
        console.error(e)
      })
  }

  save_img(){
    this.rest.save_img_user(this.userForm, this.iduser).subscribe( (data:any) => {    
        if(data.error == true){
            this.repo.presentAlert("La imagen no ha podido ser subida por favor intente de nuevo", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
        } else {
          this.info_user.img = data.data.img;
        }
    })
  }


  validate_info(data) {
    return data == '' || data == null || data == undefined ? true : false;
  }

  updateDate() {

    if(this.validate_info(this.info_user.name) || this.validate_info(this.info_user.lname) || this.validate_info(this.info_user.phone) || this.validate_info(this.info_user.cedula)) {
      this.repo.presentAlert("Es necesario que la información este completa para poder realizar la actualización", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
    } else {
      
      this.rest.update_user(this.info_user, this.iduser).subscribe( (resp:any) => {

          if(this.avialableToUpdate == true) {
            this.save_img();
          }
          
          if(resp.error) {
            this.repo.presentAlert(resp.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT)
          } else {
            this.repo.presentAlert("Se ha actualizado de forma correcta", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT); 
          }

      })
    }



  }


}
