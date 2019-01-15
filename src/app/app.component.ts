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
    public locationAccuracy: LocationAccuracy
  ) {

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }
    
    });

    this.storage.get('xx-loap-inst').then((instructive) => {
      if(instructive){
        this.storage.get('xx-app-loap').then((val) => {
          console.log("INFORMACION DEL STORAGE CUANDO INGRESA", val);
          this.rootPage = val ? TabsPage : LoginPage;
          });
        } else {
          this.rootPage = InstructivePage;
        }
    })


    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'start', component: HomePage },
      { icon: 'start', component: ListPage },
      { icon: 'start', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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
