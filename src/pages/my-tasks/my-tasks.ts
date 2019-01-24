import { ProgressInTaskPage } from './../progress-in-task/progress-in-task';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MyTasksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-tasks',
  templateUrl: 'my-tasks.html',
})
export class MyTasksPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public rest: ServicesProvider,
    public alertCtrl: AlertController
    ) {
  }

  type_task: string = 'Encurso';

  lits_task: any = {
    task_approved: [],
    task_by_correction: [],
    task_by_review: [],
    task_in_process: [],
    task_rejected: []
  };
  ionViewDidLoad() {
    this.get_task();
    let time = setInterval(() => {
      this.get_task();
    }, 60000);

  }

  get_task(){
    this.storage.get('xx-app-loap').then( (loap: any) => {
      let user = JSON.parse(loap);
      this.rest.get_states_task(user.data.data._id).subscribe((respons: any) => {
        if(respons.error) {
          
        } else {
          this.lits_task = respons.data;
        }
      })
    })
  }



  continue_task(data: any) {
    this.storage.get('xx-app-loap').then( (loap: any) => {
      let user = JSON.parse(loap);
      this.rest.get_studie(data.id_studie).subscribe((data: any) => {
        this.navCtrl.push(ProgressInTaskPage, {data: data.data, iduser: user.data.data._id});
      })
    })
  }

  razon(data: any) {
    console.log("Esta es la razón del tema", data);
    this.presentAlert("Razón del rechazo", data.comments.observations)    
  }


  doRefresh(element){
    
    this.get_task();
    setTimeout(() => {
      element.complete();
    }, 2500);
    console.log("Proceso to refresh")
  }
  
  presentAlert(title:string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  view_datail(data: any){

  }

  

}
