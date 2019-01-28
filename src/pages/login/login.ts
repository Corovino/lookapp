
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

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { SplashScreen } from '@ionic-native/splash-screen';




/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 
 */

// @IonicPage()
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
    public locationAccuracy: LocationAccuracy,
    public splashscreen: SplashScreen,
    public fb: Facebook
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

  getfacebook() {

    if(this.forms.check1f == false){
      this.presentAlert("", "Para continuar debe aceptar términos y condiciones.");
    } else if(this.forms.check2f == false) {
      this.presentAlert("", "Para continuar debe aceptar Habbeas Data.");
    } else {
      
      this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        
        const permissions = ["public_profile", "email", "user_gender", "user_age_range", "user_birthday"];

        this.fb.api("/me?fields=name,email,picture,gender", permissions)
        .then(user =>{


          this.rest.connect_facebook(user).subscribe((response:any) => {

            if(response.token){
              this.storage.set('xx-app-loap', JSON.stringify(response));
              setTimeout(() => {
                this.splashscreen.show();
                window.location.reload();
              }, 1000)
            } else {
              let iduser = response.data == null ? '' : response.data.id;
              this.navCtrl.setRoot(InstructivePage, {
                userfacebook: user,
                iduser: iduser
              });
            }


          })
          // console.log(user, "this is my usere")
        }).then(da => {
          console.log("Segundo",da)
        }).catch(e => {
          console.log("Error no connecto with facebook", e);
        })        
        console.log('Logged into Facebook!', res);
      })
      .catch(e => {
        console.log('Error logging into Facebook', e); 
      });
  
    }

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

  reset: any = {
    code: '',
    pass: '',
    repass: ''
  }; 

  recuperacuenta: boolean = false;
  changePass() {
    this.forms.pass = '';
    if(this.reset.code == '' || this.reset.pass == '' || this.reset.repass == '') {
      this.presentAlert("", "Es necesario que ingreses los datos necesarios");
    } else {
      this.rest.changepass(this.reset).subscribe((resp: any) => {
          if(resp.error) {
            this.presentAlert("", resp.message)
          } else {
            this.presentAlert("", "Se ha guardado de forma correcta");
            this.recuperacuenta = false;

          }
      })
    }
  }

  saveSession(){
    
    if(this.validate(this.forms.email) || this.validate(this.forms.pass)) {
      this.presentAlert("Alerta", "Usuario y contraseña requeridos")
    } else {
      this.rest.login_eyes(this.forms).subscribe((response: any) => {
        if(response.error == "mail"){
          // this.recuperacuenta = true;

          this.navCtrl.setRoot(InstructivePage, {
            useremail: response.data,
            iduser: response.data.id
          });


        } else if(response.error) {
          this.presentAlert("Error", response.message);
        }else {
          this.storage.set('xx-app-loap', JSON.stringify(response));
          this.splashscreen.show();
          window.location.reload();
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



