import { Injectable } from '@angular/core';
// import { OneSignal } from '@ionic-native/onesignal/ngx';
import {  Platform } from 'ionic-angular';


@Injectable()
export class PushnotificationProvider {

  constructor(
    // private oneSignal: OneSignal, 
    public platform : Platform) {
    console.log('Hello PushnotificationProvider Provider');
  }

  init_notifications(){

    if(this.platform.is('cordova')){
        console.log('soy cordova');
        // this.oneSignal.startInit('05078a93-8cd5-49b5-8a73-a5cb0d7112af', '193443740530');
        //this.oneSignal.startInit('517667ba-54e0-4eff-94d9-9c33dc28a54f', '193443740530');
    
        // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        
        // this.oneSignal.handleNotificationReceived().subscribe(() => {
        //   console.log('Notificacon recibida');
        // });
        
        // this.oneSignal.handleNotificationOpened().subscribe(() => {
        //   console.log('Notificacion abierta');
        // });
        
        // this.oneSignal.endInit();
    }

  }

}
