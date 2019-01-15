import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgressInTaskPage } from './progress-in-task';

@NgModule({
  declarations: [
    ProgressInTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgressInTaskPage),
  ],
})
export class ProgressInTaskPageModule {}
