import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ServicesProvider } from '../../providers/services/services';
import { GoogleMaps, GoogleMap, Marker, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions } from '@ionic-native/google-maps'
import { FormArray } from '@angular/forms';
import { CodegenComponentFactoryResolver } from '@angular/core/src/linker/component_factory_resolver';
import { Camera, CameraOptions } from '@ionic-native/camera';


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
  public formulario: any = [];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public geolocation: Geolocation,
    public alertCtrl: AlertController,
    public rest: ServicesProvider,
    private _googleMaps: GoogleMaps,
    private camera: Camera,
    private loadingCtrl: LoadingController
  ) {
    this.timeOut();
    
    
  }

  
  showLocation: any;
  ionViewDidEnter(){
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
      this.navParams.data.idt,
      this.navParams.data.data.form 
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
      this.navParams.data.idt,
      this.navParams.data.data.form
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


  loadForm(form_studie: any, iduser: number, idtask: number, price: any, id: any, form: any ){


    console.log("INFORMACION DE TODO LO QUE PUEDE PASAR", form);

    this.formulario = form;

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

































  public formshow: any = [];
  public lastTrans: String = '';
  




  validate_response(element) {
    return element == undefined || element == '' || element == null;
  }


  loding: any;
  startMessage(msm) {
    this.loding = this.loadingCtrl.create({
      content: msm,
      spinner: 'crescent',
    });

    this.loding.present();  
  }
  
  stopMessage(){
    this.loding.dismiss() ;
  }



  sendForm() {

    let inf = false;
    
    for (let e = 0; e < this.formulario.length; e++) {
      
      this.formulario[e].error = false;
      if(this.formulario[e].type == 'boxes'){
        let cnt = 0;
        this.formulario[e].data.forEach(element => {
            if(this.validate_response(element.response)){
              this.formulario[e].error = true;
              inf = true;
            } else if(element.response) {
              cnt++;
            }
          });
          
          if(cnt > 0) {
            inf = false;
            this.formulario[e].error = false;         
          }
      } else {
        let it = 0;
        if(this.formulario[e].required == true && this.validate_response(this.formulario[e].response)) {
          inf = true;
          it++;
          this.formulario[e].error = true;
        }

        if(it == 0) {
          inf = false;
        }

      }
      
    }

    if(inf == false) {
      this.geolocation.getCurrentPosition({
        enableHighAccuracy: true, // HABILITAR ALTA PRECISION
      }).then((_coords) => {      
        this.rest.save_task({
          "idtask": this.navParams.data.idt,
          "iduser": this.navParams.data.iduser,
          "form_response": this.formulario,
          "price": this.navParams.data.data.price_by_task,
          "longitude": _coords.coords.longitude,
          "latitude": _coords.coords.latitude,
          "id": this.navParams.data.data.id
        }).subscribe( (resp: any) => {
          if(resp.error == true) {
            this.presentAlert("", "No hemos podido guardar tu tarea");
          } else {
            this.presentAlert("", "Se ha guardado de forma correcta")
          }
        })
      })
    }
  }


  public image: any;
  public info_user: any;
  public userForm: any = new FormData();

  take_photo(object) {

    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetHeight: 500,
      targetWidth: 500,
      quality: 100,
      allowEdit: true,
      saveToPhotoAlbum: true
    }
    
    this.startMessage("Obteniendo georeferenciación");
    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true, // HABILITAR ALTA PRECISION
    }).then((_coords) => {
      
      this.stopMessage();
      this.camera.getPicture(options)
      .then(data => {
        this.image = `data:image/jpeg;base64,${data}`;
        let img = this.dataURLtoFile(`data:image/jpeg;base64,${data}`, 'a.png');
        
        this.userForm.delete('File');
        this.userForm.append('File', img);
        
              this.startMessage("Guardando imagen.");
              this.rest.save_img_get_url(this.userForm).subscribe( (resp:any) => {
                
                object.src = resp.img;
                object.lat = _coords.coords.latitude;
                object.lng = _coords.coords.longitude;
                
                this.stopMessage();
              })


          }).catch(e => {
            this.stopMessage();
          })
          
        }).catch((error) => {
          this.stopMessage();
        });
        
        


        

  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

}
