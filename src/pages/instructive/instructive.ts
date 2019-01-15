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
  public register: any = { tcedula: 'CC', name: '', lname: '', sex: '', birth_day: '', level_studie: '', strate: '', how_do_you_find_me: '', phone: '', log: '', lat: '', device: '', mark_device: '' };
  public forms: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public device: Device,
    public rest: ServicesProvider,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public splashscreen: SplashScreen
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

  step_two() {
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
      this.validate(this.register.how_do_you_find_me) ||
      this.validate(this.register.phone) || 
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
          // this.storage.set('xx-app-loap', JSON.stringify(data));
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
