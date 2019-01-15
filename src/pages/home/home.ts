import { ProgressInTaskPage } from './../progress-in-task/progress-in-task';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, NavPopAnchor, AlertController } from 'ionic-angular';
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

  
  nombre: string = "Su nombre";
  listp: any;
  name: any = "Jerry";
  
  changeName() {
    this.nombre = "Otro nombre";
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
    public device: Device
    
    ) {
      
      this.get_studies();


      this.repo = new UtilitiesClass();
      let time = setInterval(() => {
        this.get_studies();
      }, 30000);

      if(time){
        console.log(time);
      }
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
      }, 2500);
      console.log("Proceso to refresh")
    }
    

    take_taks(data: any) {
      this.navCtrl.push(DetailTaskPage, {data: data});    
    }
    // 
    // 
    //  >>>>>>>>>>>>>>>>< PROCESO TO GET LOCAL  NOTIFICACON
    // 
    // 
    // 
    getSMS() {
      this.sms.send('3004862620', "Hola a todos, otro tema");
      // this.sms.send('3003463203', "Hola a todos, toma tu link  https://www.classmarker.com/online-test/start/?quiz=ngk5bb77097d61c5 ");
    }
    // 
    // 
    //  >>>>>>>>>>>>>>>>< PROCESO TO GET LOCAL  NOTIFICACON
    // 
  // 
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
      // sound: isAndroid ? 'file://sound.mp3' : 'file://beep.caf',
      // data: { secret: key }
    });
  }

  

  //   ///////////////// LOAD MAP
  // 
  // Load map

moveCamera(loc: LatLng){
  
  let options: CameraPosition<LatLng> = {
      target: loc,
      zoom: 20,
      tilt: 100
    }
    this.map.moveCamera(options)

    
}

//Adds a marker to the map
createMarker(loc: LatLng, title: string, color){
    let markerOptions: MarkerOptions = {
      position: loc,
      icon: color,
      title: title
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
      zoom: 4,
      center: {lat: 4.5876996, lng: -83.394205}
    
  })


}


mark: any = [];

create_a_marker(){
  let markerOptions: MarkerOptions = {
    position: {"lat": 4.6724325744368, "lng": -74.06218524704866},
    icon: 'red',
    title: 'Jerry Lagos uno'
  };
  this.map.addMarker(markerOptions).then((marker: Marker) => {
      this.mark.push(marker)
  });
}  


  markers: any = [];
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

      // let watch = this.geolocation.watchPosition();


      let polygono_4: ILatLng[] = [
          {"lat": 4.6724325744368, "lng": -74.06218524704866},
          {"lat": 4.6747636839902365, "lng": -74.06169172058992},
          {"lat": 4.6747636839902365, "lng": -74.06287189255647},
          {"lat": 4.67186583562157, "lng": -74.0632903171628},
          {"lat": 4.671320482744213, "lng": -74.06231399308137},
          {"lat": 4.671673358183879, "lng": -74.06046863327913},
          {"lat": 4.6743252648956055, "lng": -74.05941720734529},
          {"lat": 4.674528434754058, "lng": -74.06090851555757},
          {"lat": 4.67186583562157, "lng": -74.06176682244234}
      ];
      
      let a = 0;
      watch.subscribe((resp: any) => {
        //Once location is gotten, we set the location on the camera.
        
            
        
        loc = new LatLng(resp.coords.latitude, resp.coords.longitude);
        this.moveCamera(loc);
        let colorToPoly = Poly.containsLocation(loc, polygono_4) ? 'green' : 'blue';
        
        this.map.addPolygon({
          points: polygono_4,
          clickable: false,
          strokeColor: '#AA00FF',
          fillColor: 'red',
          strokeWidth: 10
        }).then((polyline: Polygon) => { 
  
        })
        a++;
        this.createMarker(loc, "Me "+a , colorToPoly ).then((marker: Marker) => {
          this.markers.push(marker);
          marker.showInfoWindow();
        }).catch(err => {
          console.log(err);
        });

        if(a > 5) {
          let b = a - 4;
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
  
  ionViewDidLoad(){
    // Make Call to loadMap that get map
    // this.loadMap();
  }

  OnButtonCLick(){
    // Meka call to loadMap that get Map 
    this.loadMap();
  }


  // 
  // 
  //   <<<<<<<<<<<<<<<<<<<<<<<<<<<<< BUTTON TO CAMERA
  // 
  // 

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
        //Usage example:
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

  constructor(
    public params: NavParams, 
    public navCtrl: NavController,
    public storage: Storage,
    public rest: ServicesProvider,
    public alertCtrl: AlertController
  ) {

    this.estudio = this.params.data.data;
    console.log(this.estudio);
    
  }

  // public nombre: string = "Esta informacion es imperativa";
  ionViewDidLoad(){

    
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

            console.log(data, "JERRY LAGOS DETALLE TAREA");
            this.navCtrl.push(SkipsPage, {data: data, iduser: user.data.data._id})
            // this.navCtrl.push(ProgressInTaskPage, {data: data, iduser: user.data.data._id})
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
    // 

  }

}
