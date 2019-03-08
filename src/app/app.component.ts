
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { LocationAccuracy } from '@ionic-native/location-accuracy';


// import { Network } from '@ionic-native/network/ngx';


@Component({
  templateUrl: 'app.html'
})


export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  store: any;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public storage: Storage,
    public locationAccuracy: LocationAccuracy,
    public alertCtrl: AlertController
    // ,private net: Network

  ) {

    this.initializeApp();
    // ESTADO DE LA CONEXION
    // this.stateConnect();
  
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }
    });

    this.storage.get('xx-app-loap').then((val) => {
      this.rootPage = val ? TabsPage : LoginPage;
    });

  



  }

  stateConnect() {
    // console.log(this.network.onDisconnect() ,   "THIS IS MY NETWORK");


    // //  watch network for a disconnection
    // this.network.onDisconnect()
    // .subscribe((info) => {
    //   console.log(info)
    //   console.log("ESTADO DESCONEXTAS");
    //   // this.presentAlert("", "No hay conexión a Internet");
    // });
 }



  presentAlert(title:string, message: string) {
    
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Aceptar']
    });
    alert.present();

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.splashScreen.hide();
      this.statusBar.styleDefault();

      // var notificationOpenedCallback = function(jsonData) {
      //   console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      // };
  
  
      // window["plugins"].OneSignal
      //   .startInit("9aca3e8c-f53f-4103-b676-5401edfedd7c", "38855676408")
      //   .handleNotificationOpened(notificationOpenedCallback)
      //   .endInit();
    
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }


}
