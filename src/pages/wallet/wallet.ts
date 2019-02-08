import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})


export class WalletPage {
  
  intervalWallet: any;
  list_wallet: any;
  showAvailable: boolean = false;
  showByPay: boolean = false;
  user: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public rest: ServicesProvider,
    public storage: Storage) {


      this.storage.get('xx-app-loap').then( (loap: any) => {
        this.user = JSON.parse(loap);
        this.get_service_pay(this.user);
      })

      this.intervalWallet = setInterval(() => {
        this.get_service_pay(this.user);
      }, 60000);
    }
    
    
  doRefresh(element) {
      this.get_service_pay(this.user);
      setTimeout(() => {
        element.complete();
      }, 1000);
  }

  get_service_pay(user: any) {
    // this.rest.get_dept_to_userpayment(14438).subscribe((resp:any) => {
    this.rest.get_dept_to_userpayment(user.data.user._id).subscribe((resp:any) => {
        this.list_wallet = resp.data;
    })
  }


  ionViewDidLeave(){
    clearInterval(this.intervalWallet);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
  }

}
