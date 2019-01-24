import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, DomController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ServicesProvider } from '../../providers/services/services';

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


  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public geolocation: Geolocation,
    public alertCtrl: AlertController,
    public rest: ServicesProvider
  ) {
    
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
  ionViewDidLoad() {

    this.loap_instructives = this.navParams.data.data.loap_instructives;
    this.name_studie = this.navParams.data.data.name;

    
    this.loadForm(
      this.navParams.data.data.form_studie, 
      this.navParams.data.iduser,
      this.navParams.data.data.id,
      this.navParams.data.data.price_by_task
    );

  }

  loadForm(form_studie: any, iduser: number, idtask: number, price: any ){

    console.log(document.getElementById('formio'), "sdsfsd sdf sdf ");
    form_studie.owner = '5bdc91b1851af95d8e5b537d';
    Formio.icons = 'fontawesome';



    console.log(this.idform.nativeElement);

    var data = document.createElement('div');
    // document.getElementById('formio')
    Formio.createForm( this.idform.nativeElement,
    form_studie
    ).then(form => {

      form.nosubmit = true;
      // Triggered when they click the submit button.
      
      
      this.geolocation.getCurrentPosition().then((resp) => {
        let state: any;
        form.on('submit', function(submission) {
            
            let response = [];
            // console.log(form_studie.components);

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
            console.log("JERRY ESTATE");
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
