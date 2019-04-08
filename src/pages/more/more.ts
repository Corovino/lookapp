import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RepoProvider } from '../../providers/repo/repo';
import { Message_rpt } from '../../clases/letters';

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
    public repo: RepoProvider,
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
          this.repo.presentAlert("Pronto estará disponible  esta funcionalidad ",[Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
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



  
  terminos(){
    let browser = this.iab.create('http://lookapp.com.co/politicas-tratamiento-de-la-informacion/');

    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    });

    //browser.close();
  }

  faq() {
    let browser = this.iab.create('http://lookapp.com.co/faq/');
    browser.on('loadstop').subscribe(evet => {
      browser.insertCSS({ code: "body{color: red}"})
    })

    //browser.close();
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
