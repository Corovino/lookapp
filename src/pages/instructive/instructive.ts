import { Component, ɵConsole } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { create_acount_interfaces } from '../../models/user.models';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { ServicesProvider } from '../../providers/services/services';
import { Geolocation } from '@ionic-native/geolocation';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
    mark_device: '' 
  };
  
  public forms: any;
  public userForm = new FormData();
  // Estates to change un date
  public step_one: boolean = true;
  public step_two: boolean = false;
  public step_three: boolean = false;
  public step_four: boolean = false;



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
  
    ) {

      this.forms = this.navParams.data.forms;
      this.get_gelocalitation();
    }
  
  ionViewCanEnter(){
    console.log("ionViewVillEnter ciclo one");
  }

  ionViewDidLoad(){
    console.log("ioncViewDidLoad ciclco dos")
  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter ciclo tres")
  }

  ionViewDidEnter(){
    console.log("ionViewWillEnter ciclo cuatro")
  }

  ionViewCanLeave(){
    console.log("ionViewCanleacer ciclo five")
  }

  ionViewDidLeave(){
    console.log("ionViewDidLeave ciclo sis")
  }

  ionViewWillUnload(){
   console.log("ionViewWillUnload ciclo siente")
  }

  dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
  }

  image: any;
  file: any;
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
        // this.image = `data:image/jpeg;base64,${data}`;
        //Usage example:
        this.file = this.dataURLtoFile(`data:image/jpeg;base64,${data}`, 'a.png');
        this.userForm.delete('img');
        this.userForm.append('img', this.file);
        
        this.rest.save_img_user(this.userForm, 4).subscribe( (data:any) => {
            
            if(data.error == true){
                this.presentAlert("Alert", "La imagen no ha podido ser subida por favor intente de nuevo");
            } else {
              this.image = data.data.img;
            }
        })

      }).catch(e => {
        console.error(e)
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

      // this.presentAlert("Alert", "Es necesario activar tu geolocalización para el registro");
    } else if(
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
      this.presentAlert("Alert", "No se pueden tener datos incompletos")
    } else {
    
      if(this.iduser == 0){
        this.rest.create_user_step_one(this.forms).subscribe((response: any ) => {
          if(!response.error) {
            this.iduser = response.data.id;
            this.next_data(response);
          } else {
            this.presentAlert("Error", response.message);
          }
        })
      } else {
        // this.next_data();
      }
    }
  }

  next_data(data) {

    this.rest.create_user_step_two(this.register, this.iduser).subscribe((response: any) => {
      if(response.error) {
        this.presentAlert("Alerta", response.message);
      }else {
        this.rest.login_eyes({
          email: this.forms.email,
          pass: this.forms.pass
        }).subscribe( (rp:any) => {
          this.storage.set('xx-app-loap', JSON.stringify(rp));
          this.navCtrl.setRoot(TabsPage);
        })
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
