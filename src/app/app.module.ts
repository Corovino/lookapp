import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage, DetailTaskPage, } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleMaps } from '@ionic-native/google-maps';


import { LocalNotifications } from '@ionic-native/local-notifications';

import { IonicStorageModule } from "@ionic/storage";
import { LoginPage, ResetPage } from '../pages/login/login';
import { ServicesProvider } from '../providers/services/services';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Camera } from '@ionic-native/camera';

import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { TokenInterceptor } from '../middleware/interceptor.middleware';
import { InstructivePage } from '../pages/instructive/instructive';
import { TabsPage } from '../pages/tabs/tabs';
import { WalletPage } from '../pages/wallet/wallet';
import { PerfilPage, } from '../pages/perfil/perfil';
import { MyTasksPage } from '../pages/my-tasks/my-tasks';
import { ProgressInTaskPage, ModalInstructions } from '../pages/progress-in-task/progress-in-task';
import { MorePage } from '../pages/more/more';
import { SkipsPage } from '../pages/skips/skips';
import { EditPerfilPage } from '../pages/edit-perfil/edit-perfil'


// import { Network } from '@ionic-native/network/ngx';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


import { LetterPipe } from '../pipes/letter/letter';
import { FormPage } from '../pages/form/form';
import { Globalization } from '@ionic-native/globalization';
import { RepoProvider } from '../providers/repo/repo';
import { InAppBrowser } from '@ionic-native/in-app-browser';

// import { OneSignal } from '@ionic-native/onesignal';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    ResetPage,
    InstructivePage,
    TabsPage,
    WalletPage,
    PerfilPage,
    EditPerfilPage,
    ProgressInTaskPage,
    DetailTaskPage,
    MyTasksPage,
    MorePage,
    ModalInstructions,
    SkipsPage,
    FormPage,
    LetterPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode:'md'
    }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  exports: [
    LetterPipe
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    ResetPage,
    InstructivePage,
    TabsPage,
    WalletPage,
    PerfilPage,
    EditPerfilPage,
    MyTasksPage,
    DetailTaskPage,
    ProgressInTaskPage,
    MorePage,
    FormPage,
    ModalInstructions,
    SkipsPage
  ],
  providers: [
    StatusBar,
    Geolocation,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass:TokenInterceptor, multi: true},
    ServicesProvider,
    Camera,
    LocalNotifications,
    LocationAccuracy,
    HttpClient,
    GoogleMaps,
    // OneSignal,
    Globalization,
    Device,
    InAppBrowser,
    RepoProvider,
  ]
})
export class AppModule {}
