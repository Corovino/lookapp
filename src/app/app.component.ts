
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { LocationAccuracy } from '@ionic-native/location-accuracy';


// import { Network } from '@ionic-native/network/ngx';

// import { Globalization } from '@ionic-native/globalization/ngx';
import { Globalization } from '@ionic-native/globalization';
// import { PushnotificationProvider } from '../providers/pushnotification/pushnotification';

import { Network } from '@ionic-native/network';


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
    public alertCtrl: AlertController,
    private globalization: Globalization,
    private net: Network
    // public pushNotification: PushnotificationProvider
  ) {


    


    Network.prototype.onDisconnect().subscribe(d => {
      console.log("JERRY LAGOS",  d)
      d
    })


    
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
      
      
      
      let disconnectSubscription = this.net.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
      });
      
      // stop disconnect watch
      disconnectSubscription.unsubscribe();
      
      
      // watch network for a connection
      let connectSubscription = this.net.onConnect().subscribe(() => {
        console.log('network connected! //////////////////////////////////////////////////////////////////////////////////');
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          if (this.net.type === 'wifi') {
            console.log('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });
      
      // stop connect watch
      connectSubscription.unsubscribe();
      
      
      
      
      this.globalization.getDatePattern({formatLength:'full', selector:'date and time'})
      .then(res => console.log("GLOBALIZACION JERRY LAGOS", res))
      .catch(e => console.log(e));
      

      this.initializeApp();
      
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
      console.log("im ready");
      // this.pushNotification.init_notifications();
      // var notificationOpenedCallback = function(jsonData) {
      //   console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      // };
  

      // window["plugins"].OneSignal
      //   .startInit("9aca3e8c-f53f-4103-b676-5401edfedd7c", "38855676408")
      //   .handleNotificationOpened(notificationOpenedCallback)
      //   .endInit();


      // this.globalization.getPreferredLanguage()


      
      
    // watch network for a disconnection

    
    }, (err) => {
      console.log("Informacion ", err, "this in my callback")
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
  


}
