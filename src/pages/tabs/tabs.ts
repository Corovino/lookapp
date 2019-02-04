import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MyTasksPage } from '../my-tasks/my-tasks';
import { PerfilPage } from '../perfil/perfil';
import { WalletPage } from '../wallet/wallet';
import { MorePage } from '../more/more';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  pages = [
    { title:'Tareas', icon: 'paper', component: HomePage },
    { title:'Mis tareas', icon: 'star', component: MyTasksPage },
    { title:'Mi perfil', icon: 'person', component: PerfilPage },
    { title:'Billetera', icon: 'folder', component: WalletPage },
    { title:'Mas', icon: 'more', component: MorePage }
  ];

  constructor(public navCtrl: NavController) {}

}
