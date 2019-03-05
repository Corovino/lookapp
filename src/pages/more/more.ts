import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

/**
 * Generated class for the MorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public alertCtrl: AlertController,
    public splashscreen: SplashScreen,
    public iab: InAppBrowser) {
  }

  ionViewDidLoad() {
  }
  
  cerrarSesion(){
    this.storage.remove('xx-app-loap');
    setTimeout(() => {
      this.splashscreen.show();
      window.location.reload();
    }, 1000) 
  }

  action_click(option) {
    switch (option) {
      case 5: 
          this.cerrarSesion();
        break;

      case 4:
          this.presentAlert("Alerta", "No se ha programado esta funcionalidad");
      break

      case 3:
          this.terminos();
      break

      case 1:
          this.faq();
      break

    
      default:
        break;
    }
  }


  send_feedback() {
    
  }

  presentAlert(title:string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  
  terminos(){
    let browser = this.iab.create('http://lookapp.com.co/politicas-tratamiento-de-la-informacion/');

    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    });

    browser.close();
  }

  faq() {
    let browser = this.iab.create('http://lookapp.com.co/faq/');
    browser.on('loadstop').subscribe(evet => {
      browser.insertCSS({ code: "body{color: red}"})
    })

    browser.close();
  }


  list_config: any = [
    {
      icon: 'assets/imgs/ayuda.png',
      text: 'Ayuda',
      action: 1
    },
    {
      icon: 'assets/imgs/escribenos.png',
      text: 'Escríbenos',
      action: 2
    },
    {
      icon: 'assets/imgs/tyc.png',
      text: 'Términos y condiciones',
      action: 3
    },
    {
      icon: 'assets/imgs/referir.png',
      text: 'Referir amigos',
      action: 4
    },
    {
      icon: 'assets/imgs/logout.png',
      text: 'Cerrar sesión',
      action: 5
    },
  ]

}
