import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InstructivePage } from './instructive';

@NgModule({
  declarations: [
    InstructivePage,
  ],
  imports: [
    IonicPageModule.forChild(InstructivePage),
  ],
})
export class InstructivePageModule {}
