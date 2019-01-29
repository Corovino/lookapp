import { ProgressInTaskPage } from './../progress-in-task/progress-in-task';
import { Component, ElementRef, ViewChild, ɵConsole } from '@angular/core';
import { NavController, NavParams, NavPopAnchor, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { GoogleMaps, GoogleMap, Marker, GoogleMapsEvent, ILatLng, Polygon, Poly, Encoding,  LatLng, CameraPosition, MarkerOptions, Circle } from '@ionic-native/google-maps'
// import { GoogleMaps, GoogleMap, GoogleMapOptions, Environment, Marker, GoogleMapsEvent, LocationService, MyLocation, MyLocationOptions, ILatLng, Polyline, Polygon, Poly, LatLng, CameraPosition, MarkerOptions, LatLngBounds} from '@ionic-native/google-maps'
import { ServicesProvider } from '../../providers/services/services';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { catchError, dematerialize, timeInterval } from 'rxjs/operators';
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

  list_studies_test: any = {error: true, data: ''};
  get_studies_test(){

    this.storage.get('xx-app-loap').then( (loap: any) => {

      let user = JSON.parse(loap);

      this.rest.get_studies_test(user.data.user._id)
      .subscribe((resp: any) => {
          if(!resp.error) {
            this.list_studies_test = resp;
          }
      })

    })
  }

  doRefresh(element){
    this.get_studies();
    this.get_studies_test()

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
    public device: Device,
    public loadingCtrl: LoadingController
  ) { 
    this.estudio = this.params.data.data;
   }

/////////////////// LOAD MAP
// 
// Load map
// MOVE CAMERA
moveCamera(loc: LatLng){
  let options: CameraPosition<LatLng> = {
    target: loc,
    zoom: 17
    ,tilt: 10
  }
  this.map.moveCamera(options);
}


showLocation: any;
ionViewDidEnter(){
  this.loadMap();
}


ionViewDidLeave(){
  clearInterval(this.showLocation);
}

//Adds a marker to the map
createMarker(loc: LatLng, title: string, color){
    let markerOptions: MarkerOptions = {
      position: loc,
      icon: color
    };
    return this.map.addMarker(markerOptions);
}

// ADD polylines
createPolilyne(element) {
  this.map.addPolygon({
    points: element,
    clickable: false,
    strokeColor: '#e5355b',
    fillColor: '#21212166',
    strokeWidth: 2
  })
}

// BUTTON PARA QUE LA CAMARA PONGA MY GEOLOCALIZACION EN EL PUNTO QUE ES
stateLocation: string = 'false';
getMyLocation() {
  let locd: LatLng;
  this.stateLocation = 'Buscando...';
  this.geolocation.getCurrentPosition().then((resp) => {
    locd = new LatLng(resp.coords.latitude, resp.coords.longitude);
    this.stateLocation = 'false';
    this.moveCamera(locd);
    this.createMarker(locd, "", this.color ).then((marker: Marker) => {
      this.markers.push(marker); marker.showInfoWindow();
    })
  }).catch(err => {
    this.stateLocation = 'Activa tu geolocalización';
  })
}

// know estate my ubication
validPolilyne(polines, loc) {
  let resuls = [];
  // FUNCION QUE HACE PUSHEO DEL RESULTADO DE LA FUNCION
  polines.forEach(element => {
    resuls.push(Poly.containsLocation(loc, element));
    console.log(Poly.containsLocation(loc, element), "jerrito");
  }); 
  // SE RETORNA CUANDO UNO DE LOS REUSLTADO ES IGUAL A TRUE
  var resultobj = resuls.filter(obj => { return obj == true; });
  // SE ASEGINA EL COLOR VERDE SI UNO DE LOS LUGARES ESTA TRUE
  this.color = resultobj[0] ? 'assets/imgs/tomar.png' : 'assets/imgs/me.png';
}



//Load the map 
initMap(){
  let controls: any = {compass: true, myLocationButton: false, indoorPicker: false, zoom: true, mapTypeControl: true, streetViewControl: false};
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
      zoom: 15,
      center: {lat: 4.6097538, lng: -83.3920573}
  })
}



mark: any = [];
color: any = 'assets/imgs/me.png';

markers: any = [];
points: any = [];
loadMap() {

  

  this.getMyLocation();


  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.
  let loc: LatLng;
  this.initMap();
  //once the map is ready move
  //camera into position
  this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

    if(this.estudio.type_ubication == 3) {

      
    let triangleCoords = [];
    this.estudio.ubicaciones.forEach(element => {
      
      var loc = new LatLng(element.latitud, element.longitud); 
      var Tlat = element.latitud, Tlng = element.longitud;

      var j = parseFloat(Tlat) - parseFloat("0.0009");
      var p = parseFloat(Tlng) - parseFloat("0.0009");

      triangleCoords.push([
        {lat: parseFloat(Tlat), lng: parseFloat(Tlng)},
        {lat: parseFloat(Tlat+0.0009) , lng: parseFloat(Tlng+0.0009)},
        {lat: parseFloat(j.toString()) , lng: parseFloat(p.toString())},
        {lat: parseFloat(Tlat+0.0009) , lng: parseFloat(p.toString())}
      ])
      
      this.createMarker(loc, "", 'green').then((marker: Marker) => {
        this.points.push(marker); marker.showInfoWindow();
      })
      
    });
      
      let ponies = [];
      triangleCoords.forEach(element => {
        let polw: ILatLng = element;
        ponies.push(polw);
      })
      
      ponies.forEach(element => {
        this.createPolilyne(element);
      })
      
      this.showLocation = setInterval(() => {
        
        console.log("opcion censon")
        this.geolocation.getCurrentPosition({
          enableHighAccuracy: true, // HABILITAR ALTA PRECISION
        }).then((resp) => {
          loc = new LatLng(resp.coords.latitude, resp.coords.longitude);

          console.log(resp.coords)
          this.validPolilyne(triangleCoords, loc);
          // this.moveCamera(loc);
  
          this.createMarker(loc, "Me", this.color ).then((marker: Marker) => {
            this.markers.push(marker); marker.showInfoWindow();
            for (let index = 0; index < this.markers.length; index++) {
              if(index > 1){
                this.markers[index-1].remove();
              }
            }
          })
          
         }).catch((error) => {
           console.log('Error getting location', error);
         });
      }, 1500);

  

    
    } else {

      console.log("OPCION NO IGUAL AL CENSO");

      let polines = [];
      this.estudio.ubicaciones.forEach( (element, key) => {
        let pol: ILatLng = element.json_poligono;
        polines.push(pol);
      });

      polines.forEach(element => {
        this.createPolilyne(element);
      })
  


      this.showLocation = setInterval(() => {
        this.geolocation.getCurrentPosition({
          enableHighAccuracy: true, // HABILITAR ALTA PRECISION
        }).then((resp) => {
          loc = new LatLng(resp.coords.latitude, resp.coords.longitude);
          // this.moveCamera(loc);
          this.validPolilyne(polines, loc);
  
          this.createMarker(loc, "Me", this.color ).then((marker: Marker) => {

            this.markers.push(marker); marker.showInfoWindow();
            for (let index = 0; index < this.markers.length; index++) {
              if(index > 1){
                this.markers[index-1].remove();
              }
            }

          })
        })
      }, 1500)


    }
    
  });

}

mis_cordenandas: any = [];
json_poligono : any;

onMarkerAdd(marker: Marker) {
  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    alert("Marker" + marker.getTitle() + "is ciclek")
  });
}

  

somefunction(){
  console.log("ESTA ES LA INFORMACION ESPECIAL MAS IMPORTANTE");
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
        

        if(this.color == 'assets/imgs/tomar.png') {
          this.rest.take_task({
            iduser: user.data.user._id,
            idstudie: data.id
          }).subscribe( (response: any) => {
            if(!response.error) {
              // this.navCtrl.push(SkipsPage, {data: data, iduser: user.data.data._id})
              this.navCtrl.setRoot(ProgressInTaskPage, {data: data, iduser: user.data.user._id, idt:response.data.id })
            } else {
              this.presentAlert("", "Ya haz tomado esta tarea.");    
            }
          })
        } else {
            this.presentAlert("", "No puedes realizar la tarea, asegurate de estar en el area permitida");    
        }

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
