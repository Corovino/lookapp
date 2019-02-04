import { Component, Input } from '@angular/core';

/**
 * Generated class for the UserComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent {

  text: string;
  @Input('nombre') nombre: string;

  constructor() {
    this.text = 'Hello World';
  }



}
