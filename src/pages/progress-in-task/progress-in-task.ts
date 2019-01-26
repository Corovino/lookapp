import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, DomController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ServicesProvider } from '../../providers/services/services';
import { GoogleMaps, GoogleMap, Marker, GoogleMapsEvent, ILatLng, Polygon, Poly, LatLng, CameraPosition, MarkerOptions, Circle } from '@ionic-native/google-maps'


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
  

  
  public cnttime :any;
  public timee : number = 3600; 
  public pg: any;
  timeOut(){
    this.cnttime = setInterval(() => {
      this.timee--;

      this.pg = (this.timee * 100) / 3600;


      if(this.timee == 0){
        this.presentAlert("Fin tarea", "Se hagoto tu tiempo");
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
    this.showInstructive = false
    this.loadForm(
      this.navParams.data.data.form_studie, 
      this.navParams.data.iduser,
      this.navParams.data.data.id,
      this.navParams.data.data.price_by_task
    );
  }





  name_studie: string;
  loap_instructives: string;
  pointesCreate: any;

  list_points: any;
  ionViewDidLoad() {

    this.loap_instructives = this.navParams.data.data.loap_instructives;
    this.name_studie = this.navParams.data.data.name;

    let type_studie = this.navParams.data.data.load_types_studie_id;
    
    if(type_studie == 1) {
      
      this.getPoints();
      this.pointesCreate = setInterval(() => {
        this.getPoints();
      }, 10000);
      this.loadMap();
    }      

    this.loadForm(
      this.navParams.data.data.form_studie, 
      this.navParams.data.iduser,
      this.navParams.data.data.id,
      this.navParams.data.data.price_by_task
    );

  }
  getPoints(){
    this.rest.points_to_tasks(this.navParams.data.data.id).subscribe((resp:any) => {
      this.list_points = resp.data;

      console.log(this.list_points);

    })
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
   
    let element = this.mapElement.nativeElement;
    this.map = this._googleMaps.create(element, {
      'backgroundColor': 'white',
        'gestures': {
          'scroll': true,
          'zoom': true
        },
        zoom: 10,
        center: {lat: 4.6097538, lng: -83.3920573}
    })
  
  
  }
  color: any = 'red';
  
  markers: any = [];
  points: any = [];
  loadMap() {
  
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    let loc: LatLng;
    this.initMap();
  
      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      //Get User location
      let watch = this.geolocation.watchPosition({
        enableHighAccuracy: true, // HABILITAR ALTA PRECISION
        timeout: 4000 // frecuencia
      });

        console.log(this.list_points, "JERRY LAGOS JAJAJAAJ ");


        this.list_points.forEach(element => {
          var loc = new LatLng(element.latitude, element.longitude);    
          this.createMarker(loc, "Me", 'blue' ).then((marker: Marker) => {
            this.points.push(marker); marker.showInfoWindow();
          })  
        });
  
        // watch.subscribe((resp: any) => {
        //   loc = new LatLng(resp.coords.latitude, resp.coords.longitude);
        //   this.createMarker(loc, "Me", 'assets/imgs/me.png' ).then((marker: Marker) => {
        //     this.markers.push(marker); marker.showInfoWindow();
        //   })
        // })
      
    });
  
  }
  
  ionViewDidLeave(){
    clearInterval(this.pointesCreate);
  }


  loadForm(form_studie: any, iduser: number, idtask: number, price: any ){

    form_studie.owner = '5bdc91b1851af95d8e5b537d';
    Formio.icons = 'fontawesome';


    var data = document.createElement('div');
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
                "latitude": resp.coords.latitude
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
