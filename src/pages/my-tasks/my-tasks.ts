import { ProgressInTaskPage } from './../progress-in-task/progress-in-task';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { RepoProvider } from '../../providers/repo/repo';
import { Message_rpt } from '../../clases/letters';

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
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public repo: RepoProvider
    ) {
  }

  type_task: string = 'Encurso';
  get_my_task: any;
  lits_task: any = {
    task_approved: [],
    task_by_correction: [],
    task_by_review: [],
    task_in_process: [],
    task_rejected: []
  };


  ionViewDidLoad() {
    this.get_task();
    this.get_my_task = setInterval(() => {
      this.get_task();
    }, 60000);

  }

  ionViewCanLeave(){
    clearInterval(this.get_my_task);
  }


  sendListTask(){
    this.navCtrl.setRoot(HomePage);
  }

  get_task(){
    this.storage.get('xx-app-loap').then( (loap: any) => {
      let user = JSON.parse(loap);
      this.rest.get_states_task(user.data.user._id).subscribe((respons: any) => {
        if(respons.error) {
          
        } else {

          this.lits_task = {
            task_approved: [],
            task_by_correction: [],
            task_by_review: [],
            task_in_process: [],
            task_rejected: []
          };

          this.lits_task = respons.data;
        }
      })
    })
  }




  continue_task(data: any) {

    this.repo.startMessage(Message_rpt.RTP_RETURN_TASK);
    this.storage.get('xx-app-loap').then( (loap: any) => {
      let user = JSON.parse(loap);
      this.rest.get_studie(data.id_studie).subscribe((resp: any) => {
        this.repo.stopMessage();
        this.navCtrl.push(ProgressInTaskPage, {data: resp.data, iduser: user.data.user._id, idt: data.id});
      })
    })
  }

  razon(data: any) {
    this.repo.presentAlert("Razón del rechazo", [Message_rpt.RTP_ACCEPT], Message_rpt.RTP_CLS_ACCEPT)    
  }



  doRefresh(element){
    this.get_task();
    setTimeout(() => {
      element.complete();
    }, 2500);
  }
  
  view_datail(data: any){

  }

  

}
