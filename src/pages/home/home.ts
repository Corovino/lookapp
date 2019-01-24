import { ProgressInTaskPage } from './../progress-in-task/progress-in-task';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, NavPopAnchor, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { GoogleMaps, GoogleMap, Marker, GoogleMapsEvent, ILatLng, Polygon, Poly, LatLng, CameraPosition, MarkerOptions } from '@ionic-native/google-maps'
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

      this.repo = new UtilitiesClass();
      let time = setInterval(() => {
        this.get_studies();
      }, 60000);

      // time;
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
    }, 1500);
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
  }

/////////////////// LOAD MAP
// 
// Load map



moveCamera(loc: LatLng){
  
  let options: CameraPosition<LatLng> = {
    target: loc,
    zoom: 10,
    tilt: 100
  }
  this.map.moveCamera(options);

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

  let controls: any = {compass: true, myLocationButton: false, indoorPicker: false, zoom: true, mapTypeControl: false, streetViewControl: false};
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
      zoom: 2,
      center: {lat: 4.6724325744368, lng: -74.06218524704866}
    
  })


}


mark: any = [];



markers: any = [];
loadMap() {

  
  this.showMapa = true;

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

    // let watch = this.geolocation.watchPosition();

    

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
      }).then((polyline: Polygon) => { 

      })
    })


    let polygono_4: ILatLng[] =[
      {
        "lat": 3.731277348047509,
        "lng": -74.4477621744598
      },
      {
        "lat": 3.8025341983214003,
        "lng": -74.4120566080536
      },
      {
        "lat": 3.8463816473523447,
        "lng": -74.3845907877411
      },
      {
        "lat": 3.9395499543125516,
        "lng": -74.34888522133485
      },
      {
        "lat": 3.9861302110535775,
        "lng": -74.37085787758485
      },
      {
        "lat": 4.131333935853243,
        "lng": -74.3214194010223
      },
      {
        "lat": 4.092980779745195,
        "lng": -74.2555014322723
      },
      {
        "lat": 4.205295485475365,
        "lng": -74.2390219400848
      },
      {
        "lat": 4.257338301316041,
        "lng": -74.2060629557098
      },
      {
        "lat": 4.314855212747135,
        "lng": -74.2170492838348
      },
      {
        "lat": 4.41892232083655,
        "lng": -74.208809537741
      },
      {
        "lat": 4.492855884524157,
        "lng": -74.1758505533661
      },
      {
        "lat": 4.550354591495906,
        "lng": -74.1758505533661
      },
      {
        "lat": 4.589020754654356,
        "lng": -74.1731435153580
      },
      {
        "lat": 4.624610967614542,
        "lng": -74.2253285739518
      },
      {
        "lat": 4.6492492991173116,
        "lng": -74.1923695895768
      },
      {
        "lat": 4.725659649274205,
        "lng": -74.1539692570736
      },
      {
        "lat": 4.8241934260003205,
        "lng": -74.08805128832364
      },
      {
        "lat": 4.8241934260003205,
        "lng": -74.03311964769864
      },
      {
        "lat": 4.785876418280698,
        "lng": -73.9946674992611
      },
      {
        "lat": 4.698286657043532,
        "lng": -74.0221333195736
      },
      {
        "lat": 4.65448763645624,
        "lng": -74.0331196476984
      },
      {
        "lat": 4.616161256332369,
        "lng": -73.9946674992611
      },
      {
        "lat": 4.555929911633641,
        "lng": -74.0221333195736
      },
      {
        "lat": 4.490217237718187,
        "lng": -74.0495991398861
      },
      {
        "lat": 4.424498644782596,
        "lng": -74.1210102726986
      },
      {
        "lat": 4.36972869119289,
        "lng": -74.1100239445734
      },
      {
        "lat": 4.320432310686761,
        "lng": -74.0880512883236
      },
      {
        "lat": 4.260176830775868,
        "lng": -74.1374897648861
      },
      {
        "lat": 4.199916630116982,
        "lng": -74.1265034367611
      },
      {
        "lat": 4.156088102391799,
        "lng": -74.1265034367611
      },
      {
        "lat": 4.1177361411903215,
        "lng": -74.07706496019864
      },
      {
        "lat": 4.073903066236784,
        "lng": -74.1374897648861
      },
      {
        "lat": 4.024588003178662,
        "lng": -74.1265034367611
      },
      {
        "lat": 3.997189453091576,
        "lng": -74.2253803898861
      },
      {
        "lat": 3.8821056175010944,
        "lng": -74.28580519457364
      },
      {
        "lat": 3.876625039876091,
        "lng": -74.3242573430111
      },
      {
        "lat": 3.8163363523695004,
        "lng": -74.28031203051114
      },
      {
        "lat": 3.8108553517458894,
        "lng": -74.34622999926114
      },
      {
        "lat": 3.6793009740476634,
        "lng": -74.42862746019864
      }
    ]


 
    let a = 0;
    watch.subscribe((resp: any) => {
      //Once location is gotten, we set the location on the camera.
      
      
      loc = new LatLng(resp.coords.latitude, resp.coords.longitude);
      this.moveCamera(loc);
      let color = 'green';
      polines.forEach(element => {
        
        
        // console.log(Poly.containsLocation(loc, element), element, "JERRY LAGOS");
        color = Poly.containsLocation(loc, element) ? 'green' : 'red';
      })
      // let colorr = Poly.containsLocation(loc, polines[2]) ? 'green' : 'red';
      
    


      a++;
      this.createMarker(loc, "Me "+a , color ).then((marker: Marker) => {
        this.markers.push(marker);
        marker.showInfoWindow();
      }).catch(err => {
        console.log(err);
      });

      if(a > 5) {
        let b = a - 5;
        this.markers[b].remove();
      }
    })
    
  });

}
mis_cordenandas: any = [];
json_poligono : any;
// loadMap(){
//   // This lines are to run code in browser
//   Environment.setEnv({
//     'APY_KEY_FOR_BROWSER_RELEASE': '',
//     'API_KEY_FOR_BROWSER_DEBUG':''
//   })

// }

onMarkerAdd(marker: Marker) {
  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    alert("Marker" + marker.getTitle() + "is ciclek")
  });
}

OnButtonCLick(){
  this.loadMap();
}
















  // public nombre: string = "Esta informacion es imperativa";
  ionViewDidLoad(){ 
    // this.loadMap();
  }
  
  showMap(){

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
         level_studie: user.data.data.level_studie,
         age: user.data.data.birth_day,
         gender: user.data.data.sex,
         estrata: user.data.data.strate
      }
      
      if(level_studie == "Todos" || level_studie == segments.level_studie &&
        estrata == "Todos" || estrata == segments.estrata &&
        gender == "Todos" || gender == segments.gender
      ) {
        
        this.rest.take_task({
          iduser: user.data.data._id ,
          idstudie: data.id
        }).subscribe( (response: any) => {
          if(!response.error) {
            // this.navCtrl.push(SkipsPage, {data: data, iduser: user.data.data._id})
            this.navCtrl.push(ProgressInTaskPage, {data: data, iduser: user.data.data._id})
          } else {
            this.presentAlert("Alert", "Ya haz tomado esta tarea.");    
          }
        })
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
