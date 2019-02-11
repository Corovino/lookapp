import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ServicesProvider } from '../../providers/services/services';
import { GoogleMaps, GoogleMap, Marker, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions } from '@ionic-native/google-maps'


/**
 * Generated class for the ProgressInTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var Formio;



@IonicPage()
@Component({
  selector: 'page-progress-in-task',
  templateUrl: 'progress-in-task.html',
})
export class ProgressInTaskPage {
  
  @ViewChild('idform') idform:any;


  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  value_heigth: number = 1;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public geolocation: Geolocation,
    public alertCtrl: AlertController,
    public rest: ServicesProvider,
    private _googleMaps: GoogleMaps,
  ) {
    this.timeOut();
  }

  
  showLocation: any;
  ionViewDidEnter(){
    console.log("INGRESO SATISFACTORIAMENTE");
  }

  ionViewWillUnload(){
    clearInterval(this.showLocation);
  }


  
  public cnttime :any;
  public timee : number = 3600; 
  public pg: any;
  timeOut(){
    this.cnttime = setInterval(() => {
      this.timee--;
      this.pg = (this.timee * 100) / 3600;

      if(this.timee == 0){
        this.presentAlert("", "Se hagoto tu tiempo");
        clearInterval(this.cnttime);
      }
    }, 1000);
  }

  // Alert
  presentAlert(title:string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  showInstructive: boolean = false ;
  
  
  gtFunction() {
    this.showInstructive = false;

    this.loadForm(
      this.navParams.data.data.form_studie, 
      this.navParams.data.iduser,
      this.navParams.data.data.id,
      this.navParams.data.data.price_by_task,
      this.navParams.data.idt
      
    );
  }





  name_studie: string;
  loap_instructives: string;
  pointesCreate: any;

  list_points: any;
  ionViewDidLoad() {

    this.loap_instructives = this.navParams.data.data.loap_instructives;
    this.name_studie = this.navParams.data.data.name;
    
    this.loadForm(
      this.navParams.data.data.form_studie, 
      this.navParams.data.iduser,
      this.navParams.data.data.id,
      this.navParams.data.data.price_by_task,
      this.navParams.data.idt
    );
      
  }


  getPoints(){
    this.rest.points_to_tasks(this.navParams.data.data.id).subscribe((resp:any) => {
      this.list_points = resp.data;
    })
  }
  //Adds a marker to the map
  createMarker(loc: LatLng, title: string, color){
      let markerOptions: MarkerOptions = {
        position: loc,
        icon: color
        , title: title
      };
      return this.map.addMarker(markerOptions);
  }
  //Load the map 

  moveCamera(loc: LatLng){
    let options: CameraPosition<LatLng> = {
      target: loc,
      zoom: 5
      ,tilt: 10
    }
    this.map.moveCamera(options);
  }

  stateLocation: string = 'false';
  getMyLocation() {
    let locd: LatLng;
    this.stateLocation = 'Buscado...';
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


  initMap(){
    
    var mapita = document.getElementById('map');
    mapita.style.height = '60%';
    mapita.style.width = '90vw';

    let controls: any = {compass: true, myLocationButton: false, indoorPicker: false, zoom: true, mapTypeControl: true, streetViewControl: false};
    let element = this.mapElement.nativeElement;
    this.map = this._googleMaps.create(element, {
      zoom: 15,
      center: {lat: 4.6097538, lng: -83.3920573},
      // gestureHandling: 'cooperative'
      gestureHandling: 'none',
      zoomControl: false
    })
  }
  color: any = 'assets/imgs/me.png';
    
  markers: any = [];
  points: any = [];
  mypoint: any = [];

  loadMap() {
  
    let loc: LatLng;
    this.initMap();
    
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
    
        this.list_points.forEach(element => {
          loc = new LatLng(element.latitude, element.longitude);
          this.createMarker(loc, '', 'assets/imgs/notomar.png').then((marker: Marker) => {
            this.points.push(marker); 
            marker.showInfoWindow();
          })
    
        });
    
    });

  
  }
  
  ionViewDidLeave(){
    clearInterval(this.pointesCreate);
  }


  loadForm(form_studie: any, iduser: number, idtask: number, price: any, id: any ){

    let type_studie = this.navParams.data.data.load_types_studie_id;
    // console.log(type_studie, "asdfadsf");
    if(type_studie == 1) {
      
      this.getPoints();
      this.pointesCreate = setInterval(() => {
        this.getPoints();
      }, 10000);

      this.value_heigth = 70;

      this.loadMap();
      this.getMyLocation();

    }   
    
    form_studie.owner = '5c4a1e846faee6135dc859a3';
    Formio.icons = 'fontawesome';

    // document.getElementById('formio')
    Formio.createForm( this.idform.nativeElement,
    form_studie
    ).then(form => {

      form.nosubmit = true;
      
      this.geolocation.getCurrentPosition().then((resp) => {
        let state: any;
        form.on('submit', function(submission) {
            
            let response = [];
            form_studie.components.forEach(element => {
              response.push({
                type: element.type,
                key: element.key,
                value: submission.data[element.key],
                label: element.label
              });
            });

            submission.response = response;
            
            fetch('http://node-express-env.eifgkdzath.us-west-2.elasticbeanstalk.com/api/v1/update_form_response_to_task', {
              body: JSON.stringify({
                "idtask": idtask,
                "iduser": iduser,
                "form_response": submission,
                "price": price,
                "longitude": resp.coords.longitude,
                "latitude": resp.coords.latitude,
                "id": id
              }),
              headers: {
                'content-type': 'application/json'
              },
              method: 'POST',
              mode: 'cors',
            })
            .then( function(response) {

              window.location.reload();
              form.emit('submitDone', submission);
              
              return response.json();
            }).catch(function(err) {
              console.log(err);
            })
          }, function(estate){
            // this.presentAlert()
          }) ;
          

          
        if(state){
          console.log("we can procees", state, state.data);
        }

      }).catch((error) => {
        this.presentAlert("Error", "No hemos podido tomar tu geolocalización, por favor activa tu GPS");
      });
    }).catch(err => {
        this.presentAlert("Error", "El formulario no se ha encontrado");
      // console.log("ERROR EN EL IO "+ err)
    });
  }

  conoce(){
    this.presentAlert("Error", "El formulario no se ha encontrado");
  }
}
