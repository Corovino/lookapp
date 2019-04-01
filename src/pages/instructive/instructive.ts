import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { ServicesProvider } from '../../providers/services/services';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RepoProvider } from '../../providers/repo/repo';
import { Message_rpt } from '../../clases/letters';

/**
 * Generated class for the InstructivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-instructive',
  templateUrl: 'instructive.html',
})
export class InstructivePage {
  
  public iduser: number = 0;
  public register: any = { 
    tcedula: 'CC', 
    name: '',
    lname: '', 
    sex: '', 
    birth_day: '', 
    level_studie: '', 
    strate: '', 
    city: '', 
    phone: '', 
    log: '', 
    lat: '', 
    device: '', 
    mark_device: '',
    idfacebook: '',
    img: '',
    userid: '',
    email: '',
    pass: '',
    repass: '',
    code: '',
  };
  
  public forms: any;
  public userfacebook: any; 
  public useremail : any;
  public userForm = new FormData();
  // Estates to change un date
  public step_one: boolean = true;
  public step_two: boolean = false;
  public step_three: boolean = false;
  public step_four: boolean = false;
  public image: any = 'assets/imgs/icon.png';
  public file: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public device: Device,
    public rest: ServicesProvider,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public camera: Camera,
    public splashscreen: SplashScreen,
    public repo: RepoProvider
  
    ) {

      this.userfacebook = this.navParams.data.userfacebook;
      this.forms = this.navParams.data.forms;
      this.useremail = this.navParams.data.useremail;
      
      if(this.forms != undefined) {
        this.register.email = this.forms.email;
      }


      if(this.userfacebook != undefined) {

        this.register.email = this.userfacebook.email;
        this.register.sex = this.userfacebook.gender == 'male' ? 'M' : 'F';
        this.register.name = this.userfacebook.name;
        this.register.idfacebook = this.userfacebook.id;

        // this.image = this.userfacebook.picture.data.url;
        // this.register.img = this.image;
        this.register.userid = this.navParams.data.iduser;

      }

      if(this.useremail != undefined) {

        this.register.email = this.useremail.email;
        this.register.sex = this.useremail.sex;
        this.register.name = this.useremail.name;
        this.register.userid = this.navParams.data.iduser;
        
      }


      this.get_gelocalitation();
    }

  
  valid_first_step_email(){
 
    if(this.register.name == '' || this.register.lname == '') {
      this.repo.presentAlert("Por favor ingrese todos los campos", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
    } else {
      this.step_two = true; 
      this.step_one = false
    }

  }


  valid_second_step() {
    if(this.register.birth_day == '' || this.register.sex == '' || this.register.strate == '' || this.register.level_studie == '' ) {
      this.repo.presentAlert("Es necesario que completes todos los datos", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
    } else {
      this.step_three = true; 
      this.step_two = false
    }
  }

  // VALIDAR CODIGO CUANDO ESTE ES ENVIADO AL CORREO
  valid_code(){
    if(this.register.code == '') {
      this.repo.presentAlert("Ingrese el código de verificación", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
    } else if(this.register.pass != this.register.repass) {
      this.repo.presentAlert("las contraseñas no coinciden", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
    } else if(this.register.pass == '' || this.register.repass == '' || this.register.email == '' || this.register.name == '' || this.register.lname == '' ) {
      this.repo.presentAlert("Por favor ingrese todos los campos", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT)
    } else {

      this.repo.startMessage("Validando información");
      this.rest.valid_code(this.register).subscribe((data:any)=> {
        this.repo.stopMessage();
        if(data.error){
          this.repo.presentAlert(data.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT)
        }else {
          this.step_two = true; 
          this.step_one = false
        }
      }, (err: any) => {
        this.repo.stopMessage();
        this.repo.presentAlert("Revisa tu conexión a internet.", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      }, () => {
        this.repo.stopMessage();
      })  
    }
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
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options)
      .then(data => {
        this.image = `data:image/jpeg;base64,${data}`;
        //Usage example:
        this.file = this.dataURLtoFile(`data:image/jpeg;base64,${data}`, 'a.png');
        this.userForm.delete('img');
        this.userForm.append('img', this.file);
      }).catch(e => {
        console.error(e);
      })
  }


  get_gelocalitation(){

    let watch = this.geolocation.watchPosition({
      enableHighAccuracy: true, // HABILITAR ALTA PRECISION
      timeout: 8000 // frecuencia
    });
    watch.subscribe((data: any) => {
        this.register.log = data.coords.longitude;
        this.register.lat = data.coords.latitude;
    });   
  }


  continue_with_register() {
    this.storage.set("xx-loap-inst", "Informacion");
    this.navCtrl.setRoot(LoginPage);

    this.splashscreen.show();
    window.location.reload();
  }

 
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad InstructivePage');
  // }

  validate(data){
    return !data || data == '';
  }

  fainally() {
    this.register.device = this.device.platform;
    this.register.mark_device = this.device.model;

    if(this.register.lat == '' || this.register.log == '') {
      let alert = this.alertCtrl.create({
        title: 'Alert',
        message: 'Es necesario tener la geolocalización activa',
        buttons: [
          {
            text: 'Ya lo he activado',
            role: 'ok',
            handler: () => {
              this.get_gelocalitation();
            }
          }
        ]
      });
      
      alert.present();

    } else if (
      this.validate(this.register.tcedula) ||
      this.validate(this.register.name) ||
      this.validate(this.register.lname) ||
      this.validate(this.register.sex) ||
      this.validate(this.register.birth_day) ||
      this.validate(this.register.level_studie) ||
      this.validate(this.register.strate) ||
      this.validate(this.register.phone) || 
      this.validate(this.register.city) || 
      this.validate(this.register.device) ||
      this.validate(this.register.mark_device) ||
      this.validate(this.register.lat) ||
      this.validate(this.register.log)
    ) {
      this.repo.presentAlert("No se pueden tener datos incompletos", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT)
    } else {
      if(this.image == 'assets/imgs/icon.png'){
        this.repo.presentAlert('Es necesario tomar tu imagen de portada', [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT)
      } else {
        if(this.forms != undefined){
          if(this.iduser == 0){
            
            this.repo.startMessage("Validando información de usuario.");
            this.rest.create_user_step_one(this.forms).subscribe((response: any ) => {
              this.repo.stopMessage();
              if(!response.error) {
                this.iduser = response.data.id;
                this.continue_register_with_email();
              } else {
                this.repo.presentAlert(response.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
              }
            }, (error: any) => {
              this.repo.presentAlert("Revisa tu conexión a internet.", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
              this.repo.stopMessage();
            }, () => {
              this.repo.stopMessage();
            })
          } else {
            this.continue_register_with_email();
          }
        } else if(this.useremail != undefined) {
          this.continue_session_with_email();
        }
      }
    }
  }
  
  message: string = 'Revisa tu conexión a internet.';
  continue_register_with_email() {
    this.repo.startMessage("Validando información");
    this.rest.create_user_step_two(this.register, this.iduser).subscribe((response: any) => {
      this.repo.stopMessage();
      if(response.error) {
        this.repo.presentAlert(response.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      }else {
        this.save_img_in_server(this.iduser);
      }
    }, (err) => {
      this.repo.presentAlert(this.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      this.repo.stopMessage();
    }, () => {
      this.repo.stopMessage();
    })
  }

  // METODO TO NEXT WITH EMAIL TO SESSION 
  iEmail: any;
  continue_session_with_email(){
    this.repo.startMessage("Validando información de usuario");
    this.rest.upload_data_to_email(this.register).subscribe((data: any) => {
        this.repo.stopMessage();
        this.iEmail = data;
        this.save_img_in_server(this.register.userid);
    }, (err) => {
      this.repo.presentAlert(this.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      this.repo.stopMessage();
    }, () => {
      this.repo.stopMessage();
    })

  }

  // when a user is register with email
  ok_email() {
    this.storage.set('xx-app-loap', JSON.stringify(this.iEmail));
    setTimeout(() => {
      this.splashscreen.show();
      window.location.reload();
    }, 1000)
  }


  // when a user is newe
  ok_session(){
    this.repo.startMessage("Revisando información de usuario.");
    this.rest.login_eyes({
      email: this.forms.email,
      pass: this.forms.pass
    }).subscribe( (rp:any) => {
      this.repo.stopMessage();
      this.storage.set('xx-app-loap', JSON.stringify(rp));
      setTimeout(() => {
        this.splashscreen.show();
        window.location.reload();
      }, 1000)
    },(err: any) => {
      this.repo.presentAlert(this.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      this.repo.stopMessage();
    }, () => {
      this.repo.stopMessage();
    })
  }
  
  // save imagen
  save_img_in_server(id){
    this.repo.startMessage("Subiendo imagen...");
    this.rest.save_img_user(this.userForm, id).subscribe( (data:any) => {
      this.repo.stopMessage();
      this.step_four = true; 
      this.step_three = false;
        if(!data.error){
          this.image = data.data.img;  
        } 
    })
  }





}
