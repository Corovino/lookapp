import { ProgressInTaskPage } from './../progress-in-task/progress-in-task';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { GoogleMaps, GoogleMap, Marker, GoogleMapsEvent, ILatLng, Poly,  LatLng, CameraPosition, MarkerOptions } from '@ionic-native/google-maps'
import { ServicesProvider } from '../../providers/services/services';

import { Camera } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  
  rootPage:any = 'ionic-pipes-home';
  list_studies: any = [];
  repo: any;
  
  constructor(
    public navCtrl: NavController, 
    private storage: Storage, 
    public rest: ServicesProvider,
    public geolocation: Geolocation,
    public camera: Camera,
    public localNoti: LocalNotifications,
    public device: Device,
    public loadingCtrl: LoadingController
    
    ) {
      
      const loding = this.loadingCtrl.create({
        content: 'Please wait...',
        duration: 1100
      });

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

  get_studies(){
    this.rest.get_studies_available()
    .subscribe((response : any) => {
      this.list_studies = response.data;
    })
  }


  // FUNCION PARA VER UNA TAREA QUE SE PUEDE TOMAR
  take_taks(data: any) {
    this.navCtrl.push(DetailTaskPage, {data: data});    
  }

  /////////////////// LOAD MAP
  ionViewDidLoad(){ }
}









@Component({
  templateUrl: 'detail_task.html'
})
export class DetailTaskPage {
  
  public estudio: any;
  // @ViewChild('map') mapElement: ElementRef;


  map: GoogleMap;
  showMapa: any = true;
  idPointToHide: number = 0;
  stateTask: boolean = false; 


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
    zoom: 5
    ,tilt: 10
  }
  this.map.moveCamera(options);
}


showLocation: any;
points_available: any;
ionViewDidEnter(){
  
  this.loadMap();
  this.get_points_availables();

}


ionViewDidLeave(){
  clearInterval(this.showLocation);
  clearInterval(this.points_available);
}

//
get_points_availables() {

  this.points_available = setInterval(() => {
    this.rest.get_points_available(this.estudio.id).subscribe((resp:any) => {
      this.estudio.ubicaciones = resp.data
    })
  }, 60000)

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
  }).catch(err => {
    this.stateLocation = 'Activa tu geolocalización';
  })
}

// know estate my ubication
validPolilyne(polines, loc) {
  let resuls = [];
  // FUNCION QUE HACE PUSHEO DEL RESULTADO DE LA FUNCION
  polines.forEach(element => {
    resuls.push({state: Poly.containsLocation(loc, element), id: element[0].id});
  }); 
  // SE RETORNA CUANDO UNO DE LOS REUSLTADO ES IGUAL A TRUE
  var resultobj = resuls.filter(obj => {  if(obj.state == true) { return obj; } });

  // SE ASEGINA EL COLOR VERDE SI UNO DE LOS LUGARES ESTA TRUE
  if(resultobj[0]){
    // this.color = resultobj[0].state ? 'assets/imgs/tomar.png' : 'assets/imgs/me.png';
    this.color = resultobj[0].state ? 'assets/imgs/me.png' : 'assets/imgs/me.png';
    this.stateTask = true;
    this.idPointToHide = resultobj[0].id;
  }

}



mark: any = [];
color: any = 'assets/imgs/me.png';

markers: any = [];
points: any = [];
loadMap() {

  

  
  
  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.
  let loc: LatLng;
  // this.initMap();

  // let controls: any = {compass: true, myLocationButton: false, indoorPicker: false, zoom: true, mapTypeControl: true, streetViewControl: false};
  // let element = this.mapElement.nativeElement;
  this.map = this._googleMaps.create('map_canva', {
    zoom: 13,
    center: {lat: 4.6097538, lng: -83.3920573},
    gestureHandling: 'cooperative'
  })

  // 'backgroundColor': 'white',
  // 'controls': {
  //   'compass': controls.compass,
  //   'myLocationButton': controls.myLocationButton,
  //   'indoorPicker': controls.indoorPicker,
  //   'zoom': controls.zoom,
  //   'mapTypeControl': controls.mapTypeControl,
  //   'streetViewControl': controls.streetViewControl
  // },
  // 'gestures': {
  //   'scroll': true,
  //   'tilt': true,
  //   'rotate': true,
  //   'zoom': true,
  // },



  //once the map is ready move
  //camera into position
  this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

    
    this.getMyLocation();
    
    //  PUNTOS SUBIDOS POR EXCEL
    if(this.estudio.type_ubication == 3) {

      
    let triangleCoords = [];
    this.estudio.ubicaciones.forEach(element => {
      

      var loc = new LatLng(element.latitud, element.longitud); 
      var Tlat = element.latitud, Tlng = element.longitud;

      var j = parseFloat(Tlat) - parseFloat("0.0009");
      var p = parseFloat(Tlng) - parseFloat("0.0009");

      triangleCoords.push([
        {lat: parseFloat(Tlat), lng: parseFloat(Tlng) , id: element.id},
        {lat: parseFloat(Tlat+0.0009) , lng: parseFloat(Tlng+0.0009)},
        {lat: parseFloat(j.toString()) , lng: parseFloat(p.toString())},
        {lat: parseFloat(Tlat+0.0009) , lng: parseFloat(p.toString())}
      ])
      
      this.createMarker(loc, element.direccion , 'green').then((marker: Marker) => {
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
        
        this.geolocation.getCurrentPosition({
          enableHighAccuracy: true, // HABILITAR ALTA PRECISION
        }).then((resp) => {
          loc = new LatLng(resp.coords.latitude, resp.coords.longitude);

          this.validPolilyne(triangleCoords, loc);
          // this.moveCamera(loc);
  
          this.createMarker(loc, "", this.color ).then((marker: Marker) => {
            this.markers.push(marker); marker.showInfoWindow();
            for (let index = 0; index < this.markers.length; index++) {
              if(index > 1){ this.markers[index-1].remove(); } 
              else if(index == 1) { this.markers[0].remove(); }
            }
          })
          
         }).catch((error) => {
         });
      }, 1500);

  

    
    } else {

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
  
          this.createMarker(loc, "", this.color ).then((marker: Marker) => {

            this.markers.push(marker); marker.showInfoWindow();
            for (let index = 0; index < this.markers.length; index++) {
              if(index > 1){ this.markers[index-1].remove(); } 
              else if(index == 1) { this.markers[0].remove(); }
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
        

        // if(this.color == 'assets/imgs/tomar.png') {
        if(this.stateTask == true) {
          this.rest.take_task({
            iduser: user.data.user._id,
            idstudie: data.id
          }).subscribe( (response: any) => {
            if(!response.error) {
              // cuando las ubicaciones son por excel
              if(this.estudio.type_ubication == 3 && this.idPointToHide != 0){
                this.rest.hide_point(this.idPointToHide).subscribe( (resp:any) => {
                  if(resp.error){
                    this.presentAlert("", resp.message);
                  } else {
                    this.navCtrl.setRoot(ProgressInTaskPage, {data: data, iduser: user.data.user._id, idt:response.data.id })
                  }
                })
              } else {
                this.navCtrl.setRoot(ProgressInTaskPage, {data: data, iduser: user.data.user._id, idt:response.data.id })
              }
              // this.navCtrl.push(SkipsPage, {data: data, iduser: user.data.data._id})
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
