
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { create_acount_interfaces } from '../../models/user.models';
import { Geolocation } from '@ionic-native/geolocation';
import { ServicesProvider } from '../../providers/services/services';
import { Device } from '@ionic-native/device';
import { InstructivePage } from '../instructive/instructive';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from '../../app/app.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { RepoProvider } from '../../providers/repo/repo';
import { Message_rpt } from '../../clases/letters';



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
    public locationAccuracy: LocationAccuracy,
    public splashscreen: SplashScreen,
    public iab: InAppBrowser,
    public repo: RepoProvider
    ) {
     
      this.geolocation.getCurrentPosition().then((resp: any) => {
        this.register.log = resp.coords.longitude;
        this.register.lat = resp.coords.latitude;
      })
  }


  // PROCES TO SEND TO INSTRUCTIVE
  knowData(){
     this.navCtrl.push(InstructivePage);
  }

  terminos(){
    const browser = this.iab.create('http://lookapp.com.co/politicas-tratamiento-de-la-informacion/');

    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    });

    browser.close();
  }

  validate(data){
    return !data || data == '';
  }

  get_session(){
    if(this.validate(this.forms.email) || this.validate(this.forms.pass ) ){
      this.repo.presentAlert("Usuario o contraseña faltante", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
    } else {

      if(this.forms.pass != this.forms.passed) {
        this.repo.presentAlert( "Las contraseñas no coinciden.", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      } else if(this.forms.check1 == false){
        this.repo.presentAlert("Para continuar debe aceptar términos y condiciones.", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      } else if(this.forms.check2 == false) {
        this.repo.presentAlert("Para continuar debe aceptar condiciones de tratamiento de datos.", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      } else {

        this.rest.validata_user(this.forms).subscribe( (response: any) => {
          if(!response.error){
            this.navCtrl.push(InstructivePage, {
              forms: this.forms
            });
          } else {
            this.repo.presentAlert(response.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
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
              this.repo.presentAlert("Es necesario tener la geolocalización activa para realizar el registro", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
              
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
      this.repo.presentAlert("Es necesario que ingreses los datos necesarios", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
    } else {
      this.rest.changepass(this.reset).subscribe((resp: any) => {
          if(resp.error) {
            this.repo.presentAlert(resp.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
          } else {
            this.repo.presentAlert("Se ha guardado de forma correcta", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
            this.recuperacuenta = false;

          }
      })
    }
  }



  
  public message_internet: string = 'Revisa tu conexión a internet.'
  saveSession(){
    
    if(this.forms.check1 == false){
      this.repo.presentAlert("Para continuar debe aceptar términos y condiciones.", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
    } else if(this.forms.check2 == false) {
      this.repo.presentAlert("Para continuar debe aceptar condiciones de tratamiento de datos.", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
    } else {

      this.repo.startMessage("Iniciando sesión.");
      this.rest.login_eyes(this.forms).subscribe((response: any) => {
        this.repo.stopMessage();
        if(response.error == "mail"){
          this.navCtrl.push(InstructivePage, {
            useremail: response.data,
            iduser: response.data.id
          });
        } else if(response.error) {
          this.repo.presentAlert(response.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
        }else {
          
          this.storage.set('xx-app-loap', JSON.stringify(response));
          setTimeout(() => {
            this.navCtrl.setRoot(MyApp);
          }, 1000);
        }
      }, (err: any) => {
        this.repo.stopMessage();
        this.repo.presentAlert(this.message_internet, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      }, () => {
        this.repo.stopMessage();
      })
    }
  }

  resetPass(){
    this.navCtrl.push(ResetPage);
  }
  // PROCESO PARA TOMAR INFORMACION DEL USUARIO ANTES DE QUE SE REGISTRE
}













@Component({
  templateUrl: 'reset.html',
})
export class ResetPage {
    
    recuperacuenta: boolean = false;
    form: any  = {email: '', code: '', pass: '', repass: ''};

    constructor(
      public navCtrl: NavController, 
      public navParams: NavParams, 
      public storage: Storage,
      public geolocation: Geolocation,
      public rest: ServicesProvider,
      public device: Device,
      public locationAccuracy: LocationAccuracy,
      public splashscreen: SplashScreen,
      public repo: RepoProvider
    ){ 
    }


    send_mail() {
      if(this.form.email == '' ) {
        this.repo.presentAlert("Por favor ingrese el correo electrónico", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      } else {
        this.rest.rend_mail_to_reset({email: this.form.email }).subscribe((resp :any)=> {
          if(resp.error == true) {            
            this.repo.presentAlert(resp.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);      
          } else if(resp.error == "mail") {

            this.navCtrl.push(InstructivePage, {
              useremail: resp.data,
              iduser: resp.data.id
            });

          } else {
            this.recuperacuenta = true;            
          }
        })
      }
    }

    changePass() {
      if(this.form.code == '' || this.form.pass == '' || this.form.repass == '') {
        this.repo.presentAlert("Es necesario que ingreses los datos necesarios", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      } else if(this.form.pass != this.form.repass) {
        this.repo.presentAlert("Las contraseñas no son iguales", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
      } else  {
        this.rest.changepass(this.form).subscribe((resp: any) => {

            if(resp.error == false){
              this.repo.presentAlert("Se ha guardado de forma correcta", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
              this.navCtrl.push(LoginPage);         
            } else if(resp.error == true) {
              this.repo.presentAlert(resp.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT)
            }
        })
      }
    }
}

