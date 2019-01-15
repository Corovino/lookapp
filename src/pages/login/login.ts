
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Alert  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { create_acount_interfaces, login_interfaces } from '../../models/user.models';
import { Geolocation } from '@ionic-native/geolocation';
import { ServicesProvider } from '../../providers/services/services';
import { FormGroup } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { TabsPage } from '../tabs/tabs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { InstructivePage } from '../instructive/instructive';
import { LocationAccuracy } from '@ionic-native/location-accuracy';



/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  // public forms: login_interfaces = { email: '', pass: '' };
  public forms: any = {
    email: '',
    pass: '',
    passed: '',
    check1: false,
    check2: false,
    check1f: false,
    check2f: false
  }
  public register: create_acount_interfaces = { tcedula: '', name: '', lname: '', sex: '', birth_day: '', level_studie: '', strate: '', how_do_you_find_me: '', phone: '', log: '', lat: '', device: '' };
  public iduser: number;
  sesion: string = "inicio";
  isAndroid: boolean = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public storage: Storage,
    public geolocation: Geolocation,
    public rest: ServicesProvider,
    public device: Device,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public locationAccuracy: LocationAccuracy
    ) {
  
      let watch = this.geolocation.watchPosition({
        timeout: 4000 // frecuencia
      });
    
      watch.subscribe((data: any) => {
          this.register.log = data.coords.longitude;
          this.register.lat = data.coords.latitude;
      });
  }


  // PROCES TO SEND TO INSTRUCTIVE
  knowData(){
     this.navCtrl.push(InstructivePage);
  }


  validate(data){
    return !data || data == '';
  }

  get_session(){
    if(this.validate(this.forms.email) || this.validate(this.forms.pass ) ){
      this.presentAlert("Error", "Usuario o contraseña faltante");
    } else {

      if(this.forms.pass != this.forms.passed) {
        this.presentAlert("Alerta", "Las contraseñas no coinciden.");
      } else if(this.forms.check1 == false){
        this.presentAlert("Alerta", "Para continuar debe aceptar términos y condiciones.");
      } else if(this.forms.check2 == false) {
        this.presentAlert("Alerta", "Para continuar debe aceptar Habbeas Data.");
      } else {

        this.rest.validata_user(this.forms).subscribe( (response: any) => {
          if(!response.error){
            this.navCtrl.setRoot(InstructivePage, {
              forms: this.forms
            });
          } else {
            this.presentAlert("Error", response.message);
          }
        })
      }

    }
  }
  // PROCESO PARA CREAR UN USUARIO
  step_one() {
    if(this.device.platform == 'Android' || this.device.platform == 'Ios'){

      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
  
        if(canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              this.get_session();         
            },
            error => {
              this.presentAlert("Información", "Es necesario tener la geolocalización activa para realizar el registro");
              console.log('Error requesting location permissions', error)
            }
          );
        }
      
      });
    } else {
      this.get_session();
    }

  
   
  }

  ionViewDidLoad() {
  }

  saveSession(){
    
    if(this.validate(this.forms.email) || this.validate(this.forms.pass)) {
      this.presentAlert("Alerta", "Usuario y contraseña requeridos")
    } else {
      this.rest.login_eyes(this.forms).subscribe((response: any) => {
        if(response.error){
          this.presentAlert("Error", response.message);
        }else {
          this.storage.set('xx-app-loap', JSON.stringify(response));
          this.navCtrl.setRoot(TabsPage);
        }
      })
    }
  }

  presentToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


  presentAlert(title:string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Aceptar']
    });
    alert.present();
  }



  // PROCESO PARA TOMAR INFORMACION DEL USUARIO ANTES DE QUE SE REGISTRE

  
}

