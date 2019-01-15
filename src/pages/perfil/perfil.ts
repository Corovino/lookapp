import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public rest: ServicesProvider,
    public storate: Storage) {
  }
  info_user: any;
  ionViewDidLoad() {
    this.storate.get('xx-app-loap').then((loap: any) => {
        let user = JSON.parse(loap);
        this.rest.get_info_user(user.data.data._id).subscribe((response:any) => {
          
          this.info_user = response.data;
          this.info_user.img == null ? this.info_user.img = "assets/imgs/icon.png" : this.info_user.img;

        })
  
    })
  }

  ionViewCanEnter(){
    console.log("ionViewVillEnter ciclo one");
  }

  // ionViewDidLoad(){
  //   console.log("ioncViewDidLoad ciclco dos")
  // }

  ionViewWillEnter(){
    console.log("ionViewWillEnter ciclo tres")
  }

  ionViewDidEnter(){
    console.log("ionViewWillEnter ciclo cuatro")
  }

  ionViewCanLeave(){
    console.log("ionViewCanleacer ciclo five")
  }

  ionViewDidLeave(){
    console.log("ionViewDidLeave ciclo sis")
  }

  ionViewWillUnload(){
   console.log("ionViewWillUnload ciclo siente")
  }



  edit_perfil(){

  }

}
