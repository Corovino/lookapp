import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProgressInTaskPage } from '../progress-in-task/progress-in-task';

/**
 * Generated class for the SkipsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-skips',
  templateUrl: 'skips.html',
})
export class SkipsPage {

  public loap_instructives: any = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    ) {
      console.log(this.navParams.data);
      this.loap_instructives = this.navParams.data.data.loap_instructives;
  }

  send_to_task(){

    this.navCtrl.push(ProgressInTaskPage, {
        data: this.navParams.data.data, 
        iduser: this.navParams.data.iduser
      }
    )
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad SkipsPage');
  }

}
