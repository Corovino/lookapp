import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ServicesProvider } from '../../providers/services/services';
import { GoogleMaps, GoogleMap, Marker, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions } from '@ionic-native/google-maps'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HomePage } from '../home/home';
import { RepoProvider } from '../../providers/repo/repo';
import { Message_rpt } from '../../clases/letters';
import { isUndefined } from 'util';


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
    public rest: ServicesProvider,
    private _googleMaps: GoogleMaps,
    private camera: Camera,
    public repo: RepoProvider,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    // this.timeOut();
  }

  getValid(data: any , form: any) {
     
    if(!data.condicional === undefined ){
      return false;
    }
     
    if(data.condicional.label != '' ) {
      
      let c = 0, state = true;
      for (let i = 0; i < form.length; i++) {
        c++;
        if(form[i].label == data.condicional.label){
          if(form[i].response == data.condicional.value_conditional){
            state = false;
          }
        }
      }

      if(c == form.length) {
        return state;
      }

    } else {
      return false;
    }
     

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
        clearInterval(this.cnttime);
      }
    }, 1000);
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



  showModalInstructions() {
    let modal = this.modalCtrl.create(ModalInstructions, this.navParams.data.data.loap_instructives);
    modal.present();
  }


  name_studie: string;
  loap_instructives: string;
  pointesCreate: any;

  list_points: any = [];
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


  getMyLocation() {
    let locd: LatLng;
    this.geolocation.getCurrentPosition().then((resp) => {
      locd = new LatLng(resp.coords.latitude, resp.coords.longitude);

      this.moveCamera(locd);
      this.createMarker(locd, "", this.color ).then((marker: Marker) => {
        this.markers.push(marker); marker.showInfoWindow();
      })
    }).catch(err => {
      this.repo.presentAlert(Message_rpt.RTP_GEO_LOST, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT)
    })
  }

  public showGeo: boolean = false;
  initMap(){
    

    this.showGeo = true; 
    var mapita = document.getElementById('map');
    mapita.style.height = '60%';
    mapita.style.width = '90vw';

    let element = this.mapElement.nativeElement;
    this.map = GoogleMaps.create(element, {
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

      if(this.list_points.length > 0) {
        this.list_points.forEach(element => {
          loc = new LatLng(element.latitude, element.longitude);
          this.createMarker(loc, '', 'assets/imgs/notomar.png').then((marker: Marker) => {
            this.points.push(marker); 
            marker.showInfoWindow();
          })
    
        });
      }
    
    });

  
  }
  
  ionViewDidLeave(){
    clearInterval(this.pointesCreate);
    this.saveFormToUpdate();
  }

  public formSaved: any;
  loadForm(form_studie: any, iduser: number, idtask: number, price: any, id: any, form: any ){

    this.showModalInstructions();
    
    this.formSaved = form;
    this.rest.get_form_to_task(id).subscribe((resp:any) =>  {

      if(form){
        if(resp.data.form_response == null) {
          this.formulario = form;
        } else {
          this.formulario = resp.data.form_response;
        }
      }

    })

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
    
    
    if(form_studie == null || form_studie == ''  ) {

    
      
    } else {
      
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
              
            }) ;
            
  
            
          if(state){

          }
  
        }).catch((error) => {
          this.repo.presentAlert("No hemos podido tomar tu geolocalización, por favor activa tu GPS", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
        });
      }).catch(err => {
          this.repo.presentAlert("El formulario no se ha encontrado", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
        // console.log("ERROR EN EL IO "+ err)
      });
    }

  }

  conoce(){
    this.repo.presentAlert("El formulario no se ha encontrado", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
  }



  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  public formshow: any = [];
  public lastTrans: String = '';
  




  validate_response(element) {
    return element == undefined || element == '' || element == null;
  }

  deleteOption(item, type, label, data) {

    let alert = this.alertCtrl.create({
      title: "Confirmación",
      subTitle: "¿Estás seguro de querer eliminar esta selección?, es posible que no la puedas volver a tomar y debas realizar la encuesta de nuevo.",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.repo.startMessage("Restaurando pregunta");

            this.rest.delete_selected({
                idtask: this.navParams.data.idt,
                iduser: this.navParams.data.iduser,
                idstudie: this.navParams.data.data.id,
                type_column: type,
                value_column: item,
                concurrence_value: item.concurrence_value,
                label: label
            }).subscribe((resp: any) => {

              this.formulario = this.formSaved;

              data.gs = false;
              data.vs = '';
              data.selected = '';
              this.repo.stopMessage();
              this.repo.presentAlert("Se ha elimado de forma correcta", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT)

            })
            
          }
        }
      ]
    });
    alert.present();
  }



  cancelTask() {


    let alert = this.alertCtrl.create({
      title: "Confirmación",
      subTitle: "¿Estás seguro de querer cancelar esta tarea?, No podrás volver acceder a ella.",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.repo.startMessage("Procesando")
            this.rest.cancel_task(this.navParams.data.idt).subscribe(resp => {
                this.repo.stopMessage();
                this.navCtrl.setRoot(HomePage)
            }) 
          }
        }
      ]
    });
    alert.present();

    
    
  }
  saveFormToUpdate() {
    // if(this.formulario.length > 0) {
    //   this.rest.save_last_modify_to_task( {form_response: this.formulario}, this.navParams.data.idt).subscribe((resp: any) => {
    //       this.repo.presentToast("Edición guardada");
    //   })
    // }
    
  }


  comproveOption(item, type, label, data) {
    
      
    if(item.concurrence){
      this.repo.startMessage("Validando disponibilidad.");
      this.rest.know_available({
        idtask: this.navParams.data.idt,
        iduser: this.navParams.data.iduser,
        idstudie: this.navParams.data.data.id,
        type_column: type,
        value_column: item.value,
        concurrence_value: item.concurrence_value,
        label: label
      }).subscribe( (resp: any) => {

        this.repo.stopMessage();
        if(resp.error){

          item.state = false;

          this.repo.presentAlert(resp.message, [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
        } else {
          data.gs = true;
          data.vs = item.label;
          data.selected = item.value;
          this.repo.presentToast("Producto seleccionado");
        }

      })
    }
    
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
          "id": this.navParams.data.idt
        }).subscribe( (resp: any) => {



          if(resp.error == true) {
            this.repo.presentAlert("No hemos podido guardar tu tarea.", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT);
          } else {
            this.repo.presentToast("Se ha guardado de forma correcta.");
            this.navCtrl.setRoot(HomePage);
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
    
    this.repo.startMessage("Obteniendo georeferenciación");
    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true, // HABILITAR ALTA PRECISION
    }).then((_coords) => {
      
      this.repo.stopMessage();
      this.camera.getPicture(options)
      .then(data => {
        this.image = `data:image/jpeg;base64,${data}`;
        let img = this.dataURLtoFile(`data:image/jpeg;base64,${data}`, 'a.png');
        
        this.userForm.delete('File');
        this.userForm.append('File', img);
        
              this.repo.startMessage("Guardando imagen.");
              this.rest.save_img_get_url(this.userForm).subscribe( (resp:any) => {
                
                object.src = resp.img;
                object.lat = _coords.coords.latitude;
                object.lng = _coords.coords.longitude;
                
                this.repo.stopMessage();
              })


          }).catch(e => {
            this.repo.stopMessage();
          })
          
        }).catch((error) => {
          this.repo.stopMessage();
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


  getValid(data: any , form: any) {

    if(data.condicional.label != '') {

      let c = 0, state = true;
      for (let i = 0; i < form.length; i++) {
        c++;
        if(form[i].label == data.condicional.label){
          if(form[i].response == data.condicional.value_conditional){
            state = false;
          }
        }
      }

      if(c == form.length) {
        return state;
      }

    } else {
      return false;
    }
  }



}



@Component({
  templateUrl: 'modal-instructions.html'
})
export class ModalInstructions {

  public loap_instructives: any;
  constructor( 
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController){

    this.loap_instructives = this.params.data;

  }

  dismiss() {
      this.viewCtrl.dismiss();
  }
}