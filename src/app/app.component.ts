import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { InstructivePage } from '../pages/instructive/instructive';
import { TabsPage } from '../pages/tabs/tabs';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';



@Component({
  templateUrl: 'app.html'
})


export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  store: any;

  user: any = {
    user: 'None',
    pass: 'None'
  };
  
  pages: Array<{icon: string, component: any}>;
  
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public storage: Storage,
    public locationAccuracy: LocationAccuracy,
    private fb: Facebook
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

  // Cerrar sesiona 
  logout() {
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
