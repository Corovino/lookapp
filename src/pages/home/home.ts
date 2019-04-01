import { RepoProvider } from './../../providers/repo/repo';


import { ProgressInTaskPage } from './../progress-in-task/progress-in-task';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { GoogleMaps, GoogleMap, Marker, GoogleMapsEvent, ILatLng, Poly, Spherical, LatLng, CameraPosition, MarkerOptions } from '@ionic-native/google-maps'
import { ServicesProvider } from '../../providers/services/services';

import { Camera } from '@ionic-native/camera';

import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { FormPage } from '../form/form';
import { Message_rpt } from '../../clases/letters';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  
  rootPage:any = 'ionic-pipes-home';
  list_studies: any = [];

  constructor(
    public navCtrl: NavController, 
    private storage: Storage, 
    public rest: ServicesProvider,
    public geolocation: Geolocation,
    public camera: Camera,
    public device: Device,
    public repo: RepoProvider
    ) {
      this.repo.startMessage(Message_rpt.RTP_CHARGIN);
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


  list_studies_prueba: any = {error: true, data: ''};
  get_studies_prueba(){
    this.storage.get('xx-app-loap').then( (loap: any) => {
      let user = JSON.parse(loap);
      this.rest.get_studies_prueba(user.data.user._id)
      .subscribe((resp: any) => {
          if(!resp.error) {
            this.list_studies_prueba = resp;
          }
      })
    })
  }




  showForm() {
    this.navCtrl.push(FormPage)
  }


  doRefresh(element){
    this.get_studies();
    this.get_studies_test();
    this.get_studies_prueba();

    setTimeout(() => {
      element.complete();
    }, 1000);
    
  }

  get_studies(){
    
    
    this.rest.get_studies_available()
    .subscribe((response : any) => {
      this.repo.stopMessage();
      this.list_studies = response.data;
    }, (err) => {
      this.repo.stopMessage();
    }, () => {
      this.repo.stopMessage();
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
    public geolocation: Geolocation,
    public camera: Camera,
    private _googleMaps: GoogleMaps,
    public device: Device,
    public repo: RepoProvider
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
    zoom: 5,
    tilt: 10
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

MyP:  LatLng;

// BUTTON PARA QUE LA CAMARA PONGA MY GEOLOCALIZACION EN EL PUNTO QUE ES
public _coords_goobals: any = {lat: '', lng: ''}
getMyLocation() {
  let locd: LatLng;
  this.repo.startMessage(Message_rpt.RTP_SEARCH_GEO);
  this.geolocation.getCurrentPosition().then((resp) => {
    
    this._coords_goobals.lat = resp.coords.latitude;
    this._coords_goobals.lng = resp.coords.longitude;

    

    locd = new LatLng(resp.coords.latitude, resp.coords.longitude);
    this.repo.stopMessage();
    this.MyP = locd;
    this.moveCamera(locd);
    this.manageData();
  }).catch(err => {
    this.repo.presentAlert(Message_rpt.RTP_GEO_LOST, [Message_rpt.RTP_ACCEPT], 'cls_accept');

  })
}


manageData() {
    let loc: LatLng;
    
    //  PUNTOS SUBIDOS POR EXCEL
    if(this.estudio.type_ubication == 3) {

      this.estudio.ubicaciones.forEach(element => {
        loc = new LatLng(element.latitud, element.longitud); 
        this.createMarker(loc, element.direccion , 'green').then((marker: Marker) => {
          this.points.push(marker); marker.showInfoWindow();
        })
      });


        
        this.showLocation = setInterval(() => {
          this.geolocation.getCurrentPosition({
            enableHighAccuracy: true, // HABILITAR ALTA PRECISION
          }).then((resp) => {
            loc = new LatLng(resp.coords.latitude, resp.coords.longitude);
    
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
  
  // this.initMap();

  // let controls: any = {compass: true, myLocationButton: false, indoorPicker: false, zoom: true, mapTypeControl: true, streetViewControl: false};
  // let element = this.mapElement.nativeElement;
  this.map = GoogleMaps.create('map_canva', {
    zoom: 13,
    center: {lat: 4.6097538, lng: -83.3920573},
    gestureHandling: 'cooperative'
  })




  //once the map is ready move
  //camera into position
  this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
    this.getMyLocation();
  });

}

mis_cordenandas: any = [];
json_poligono : any;

onMarkerAdd(marker: Marker) {
  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    alert("Marker" + marker.getTitle() + "is ciclek")
  });
}

  
  start_task(data) {


    this.repo.startMessage(Message_rpt.RTP_SEARCH_GEO);

    if(data.detail_studie.length > 0) {
      data.detail_studie = data.detail_studie[0];
    }
    
    // let rang_age = {
    //   rang_uno: data.detail_studie.ages.rang_1,
    //   rang_dos: data.detail_studie.ages.rang_2
    // }

    let level_studie = data.detail_studie.level_studie.level;
    let estrata = data.detail_studie.estrata.stratum;
    let gender = data.detail_studie.gender.type;

  
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
        
        if(this.estudio.type_ubication == 3){

          let distance_more_near: any = 999999999999999999999999999999999999, 
          a = 0,
          direccion = '',
          idPoint = '';
          
          
          this.geolocation.getCurrentPosition().then((resp) => {
            let locd = new LatLng(resp.coords.latitude, resp.coords.longitude);;
            this.repo.stopMessage();

            this.estudio.ubicaciones.forEach(element => {

              var loc = new LatLng(element.latitud, element.longitud);
              
              let result_value  = Spherical.computeDistanceBetween(locd, loc);
              
              if(result_value < distance_more_near) { 
                distance_more_near = result_value;
                direccion = element.direccion,
                idPoint = element.id
              };

              a++;

              if(a == this.estudio.ubicaciones.length) {
                if(distance_more_near < 60) {

                  this.rest.take_task({
                    iduser: user.data.user._id,
                    idstudie: data.id
                  }).subscribe( (response: any) => {
                    if(!response.error) {
                        
                        this.rest.hide_point(idPoint, response.data.id).subscribe( (resp:any) => {
                        
                        if(resp.error){
                          this.repo.presentAlert(resp.message, [Message_rpt.RTP_ACCEPT], 'cls-accept');
                          
                        } else {
                          this.navCtrl.setRoot(ProgressInTaskPage, {data: data, iduser: user.data.user._id, idt:response.data.id })
                        }

                      })
                    } else {

                      this.repo.presentAlert(response.message, [Message_rpt.RTP_ACCEPT], 'cls-accept');    
                    }
                  })
                } else {
                  this.repo.presentAlert("Estas a " + parseInt(distance_more_near) + " metros del punto más cercano. debes estar a menos de 60 metros", [Message_rpt.RTP_ACCEPT], 'cls-accept');
                }
              }
  
  
            });
          }).catch(err => {
            this.repo.stopMessage();
          })


          

        } else if(this.stateTask == true) {

          this.rest.take_task({
            iduser: user.data.user._id,
            idstudie: data.id
          }).subscribe( (response: any) => {
            if(!response.error) {
              // cuando las ubicaciones son por excel
              this.repo.stopMessage();
              this.navCtrl.setRoot(ProgressInTaskPage, {data: data, iduser: user.data.user._id, idt:response.data.id }) 
            } else {
              this.repo.presentAlert(response.message, [Message_rpt.RTP_ACCEPT], 'cls-accept');
              this.repo.stopMessage();  
            }
          })

        } else {
          this.repo.stopMessage();
          this.repo.presentAlert(Message_rpt.RTP_TASK_RECHAGE, [Message_rpt.RTP_ACCEPT], 'cls-accept');
        }



      } else {
        this.repo.stopMessage();
        this.repo.presentAlert("Esta tarea esta disponible para una población en particular", [Message_rpt.RTP_ACCEPT], 'cls-accept');
      }
    })


    /***
     *  Lo primero y mas elemental  de todo es  asegurarse de 
     *  El usuario debe cumplir con la segmentacion requerida por parte del cliente}
     *  El usuario debe estar dentro del rango permitido para realizar la tarea
     */

  }
}
