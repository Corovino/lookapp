import { ProgressInTaskPage } from './../progress-in-task/progress-in-task';
import { Component, ElementRef, ViewChild, ɵConsole } from '@angular/core';
import { NavController, NavParams, NavPopAnchor, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { GoogleMaps, GoogleMap, Marker, GoogleMapsEvent, ILatLng, Polygon, Poly, LatLng, CameraPosition, MarkerOptions, Circle } from '@ionic-native/google-maps'
// import { GoogleMaps, GoogleMap, GoogleMapOptions, Environment, Marker, GoogleMapsEvent, LocationService, MyLocation, MyLocationOptions, ILatLng, Polyline, Polygon, Poly, LatLng, CameraPosition, MarkerOptions, LatLngBounds} from '@ionic-native/google-maps'
import { ServicesProvider } from '../../providers/services/services';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SMS } from '@ionic-native/sms';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { catchError, dematerialize } from 'rxjs/operators';
import { componentFactoryName } from '@angular/compiler';
import { UtilitiesClass } from '../../models/helper.models';
import { SkipsPage } from '../skips/skips';

declare var Formio;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;

  nombre: string = "";
  listp: any;
  name: any = "";
  
  changeName() {
    this.nombre = "";
  }
  
  bounds: any;
  list_studies: any = [];
  repo: any;
  
  constructor(
    public navCtrl: NavController, 
    private storage: Storage, 
    public rest: ServicesProvider,
    public geolocation: Geolocation,
    public camera: Camera,
    private _googleMaps: GoogleMaps,
    public localNoti: LocalNotifications,
    public sms: SMS,
    public device: Device,
    public loadingCtrl: LoadingController
    
    ) {
      

      const loding = this.loadingCtrl.create({
        content: 'Please wait...',
        duration: 1500
      })

      loding.present();
      this.get_studies();
      
    }
  
  searchStudies: any;
  ionViewDidEnter(){
    this.searchStudies = setInterval(() => {
      this.get_studies();
    }, 60000);
  }

  ionViewDidLeave(){
    clearInterval(this.searchStudies);
  }

  get_studies(){
    this.rest.get_studies_available()
    .subscribe((response : any) => {
      this.list_studies = response.data;
    })
  }

  doRefresh(element){
    this.get_studies();
    setTimeout(() => {
      element.complete();
    }, 1000);
  }


  take_taks(data: any) {
    this.navCtrl.push(DetailTaskPage, {data: data});    
  }

  // 
  //  >>>>>>>>>>>>>>>>< PROCESO TO GET LOCAL  NOTIFICACON
  //

  getNotification(){
    this.localNoti.schedule({
      id: 1,
      text: 'Single ILocalNotification',
      led: { color: '#FF00FF', on: 500, off: 500 },
      vibrate: true,
      actions: [
        { id: 'yes', title: 'Yes' },
        { id: 'no', title: 'No' }
      ]
    });
  }

  

  /////////////////// LOAD MAP
  ionViewDidLoad(){

  }


  urltoFile(url, filename, mimeType){
    mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename, {type:mimeType});})
    );
  }

  dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
  }


  image: any;
  getPicture(){
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetHeight: 500,
      targetWidth: 500,
      quality: 100,
      allowEdit: true,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options)
      .then(data => {
        this.image = `data:image/jpeg;base64,${data}`;
        var file = this.dataURLtoFile(this.image, 'a.png');
      }).catch(e => {
        console.error(e)
      })
  }


}













@Component({
  templateUrl: 'detail_task.html'
})
export class DetailTaskPage {
  public estudio: any;


  @ViewChild('map') mapElement: ElementRef;

  @ViewChild('bar') info: ElementRef;


  map: GoogleMap;
  showMapa: any = true;

  constructor(
    public params: NavParams, 
    public navCtrl: NavController,
    public storage: Storage,
    public rest: ServicesProvider,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public camera: Camera,
    private _googleMaps: GoogleMaps,
    public localNoti: LocalNotifications,
    public sms: SMS,
    public device: Device,
    public loadingCtrl: LoadingController
  ) {

    this.estudio = this.params.data.data;
    // this.info.nativeElement.style.heigth = 100;
  }

/////////////////// LOAD MAP
// 
// Load map



ionViewDidEnter(){
  console.log("INGRESO SATISFACTORIAMENTE");
}




ionViewWillUnload(){
 console.log("SALIO SATISFACTORIAMENTE")
}



moveCamera(loc: LatLng){
  let options: CameraPosition<LatLng> = {
    target: loc,
    zoom: 17
    // tilt: 10
  }
}
//Adds a marker to the map
createMarker(loc: LatLng, title: string, color){
    let markerOptions: MarkerOptions = {
      position: loc,
      icon: color
      // , title: title
    };
    return this.map.addMarker(markerOptions);
}
//Load the map 
initMap(){
  let controls: any = {compass: true, myLocationButton: true, indoorPicker: true, zoom: true, mapTypeControl: true, streetViewControl: true};
  let element = this.mapElement.nativeElement;
  this.map = this._googleMaps.create(element, {
    'backgroundColor': 'white',
      'controls': {
        'compass': controls.compass,
        'myLocationButton': controls.myLocationButton,
        'indoorPicker': controls.indoorPicker,
        'zoom': controls.zoom,
        'mapTypeControl': controls.mapTypeControl,
        'streetViewControl': controls.streetViewControl
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      zoom: 10,
      center: {lat: 4.6097538, lng: -83.3920573}
      
  })


}
mark: any = [];
color: any = 'red';

markers: any = [];
points: any = [];
loadMap() {

  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.
  let loc: LatLng;
  this.initMap();

  //once the map is ready move
  //camera into position
  this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
    //Get User location
    let watch = this.geolocation.watchPosition({
      enableHighAccuracy: true, // HABILITAR ALTA PRECISION
      timeout: 4000 // frecuencia
    });

    if(this.estudio.type_ubication == 3) {

      this.estudio.ubicaciones.forEach(element => {
        var loc = new LatLng(element.latitud, element.longitud);    
        this.createMarker(loc, "Me", 'green' ).then((marker: Marker) => {
          this.points.push(marker); marker.showInfoWindow();
        })

        // let circle: Circle = 
        this.map.addCircleSync({
          center: loc,
          radius: 30,
          strokeColor: '#AA00FF',
          strokeWidth: 1,
          fillColor: '#0006',
        });


      });

      let a = 0;
      watch.subscribe((resp: any) => {
        loc = new LatLng(resp.coords.latitude, resp.coords.longitude);
        a++;
        
        this.createMarker(loc, "Me", 'assets/imgs/me.png' ).then((marker: Marker) => {
          this.markers.push(marker); marker.showInfoWindow();
        })

        if(a > 1) { a = a - 1;  this.markers[a].remove();  }
        
        
        // this.moveCamera(loc);
      })


    
    } else {

      let polines = [];
      this.estudio.ubicaciones.forEach( (element, key) => {
        let pol: ILatLng = element.json_poligono;
        polines.push(pol);
      });

      polines.forEach(element => {
        this.map.addPolygon({
          points: element,
          clickable: false,
          strokeColor: '#AA00FF',
          fillColor: '#0006',
          strokeWidth: 2
        })

      })
  
      let a = 0;
      watch.subscribe((resp: any) => {
        //Once location is gotten, we set the location on the camera.
        
        loc = new LatLng(resp.coords.latitude, resp.coords.longitude);
        this.moveCamera(loc);
        
        let resuls = [];
        // FUNCION QUE HACE PUSHEO DEL RESULTADO DE LA FUNCION
        polines.forEach(element => { resuls.push(Poly.containsLocation(loc, element)); }); 
        // SE RETORNA CUANDO UNO DE LOS REUSLTADO ES IGUAL A TRUE
        var resultobj = resuls.filter(obj => { return obj == true; });
        // SE ASEGINA EL COLOR VERDE SI UNO DE LOS LUGARES ESTA TRUE
        this.color = resultobj[0] ? 'green' : 'assets/imgs/me.png';

        a++;
        this.createMarker(loc, "Me", this.color ).then((marker: Marker) => {
          this.markers.push(marker); marker.showInfoWindow();
        })

        if(a > 2) { let b = a - 2;  this.markers[b].remove();  }


      })

    }

    // loc = new LatLng(resp.coords.latitude, resp.coords.longitude);

    
  });

}

mis_cordenandas: any = [];
json_poligono : any;

onMarkerAdd(marker: Marker) {
  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    alert("Marker" + marker.getTitle() + "is ciclek")
  });
}

// public nombre: string = "Esta informacion es imperativa";
ionViewDidLoad(){
  this.loadMap();
}
  


presentAlert(title:string, message: string) {
  let alert = this.alertCtrl.create({
    title: title,
    subTitle: message,
    buttons: ['Aceptar']
  });
  alert.present();
}


  start_task(data) {

    /**
     * La edad cuando no es "todos",
     */

    if(data.detail_studie.length > 0) {
      data.detail_studie = data.detail_studie[0];
    }
    
    let rang_age = {
      rang_uno: data.detail_studie.ages.rang_1,
      rang_dos: data.detail_studie.ages.rang_2
    }

    /**
     * 
     * El nivel de estudios 
     */
    let level_studie = data.detail_studie.level_studie.level;

    /**
     * 
     * Conocer el querido estrato
     */
    let estrata = data.detail_studie.estrata.stratum;

    /**
     * 
     * Proceso para conocer el gender
    */
     let gender = data.detail_studie.gender.type;
  
    /**
      * 
      * 
    */
  
    this.storage.get('xx-app-loap').then( (loap: any) => {

      let user = JSON.parse(loap);

      let segments = {
         level_studie: user.data.user.level_studie,
         age: user.data.user.birth_day,
         gender: user.data.user.sex,
         estrata: user.data.user.strate
      }
      
      if(level_studie == "Todos" || level_studie == segments.level_studie &&
        estrata == "Todos" || estrata == segments.estrata &&
        gender == "Todos" || gender == segments.gender
      ) {
        

        // if(this.color == 'green') {
          this.rest.take_task({
            iduser: user.data.user._id ,
            idstudie: data.id
          }).subscribe( (response: any) => {
            if(!response.error) {
              // this.navCtrl.push(SkipsPage, {data: data, iduser: user.data.data._id})
              this.navCtrl.push(ProgressInTaskPage, {data: data, iduser: user.data.user._id})
            } else {
              this.presentAlert("", "Ya haz tomado esta tarea.");    
            }
          })
        // } else {
        //     this.presentAlert("", "No puedes realizar la tarea, asegurate de estar en el area permitida");    
        // }


      } else {
        this.presentAlert("Sin acceso", "Esta tarea esta disponible para una población en particular");
      }
    })


    /***
     *  Lo primero y mas elemental  de todo es  asegurarse de 
     *  El usuario debe cumplir con la segmentacion requerida por parte del cliente}
     *  El usuario debe estar dentro del rango permitido para realizar la tarea
     */

  }
}
