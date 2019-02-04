import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { LocationAccuracy } from '@ionic-native/location-accuracy';


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
  ) {

    this.initializeApp();

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


  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleDefault();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }


}
