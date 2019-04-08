import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder} from '@angular/forms';


/**
 * Generated class for the FormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
})
export class FormPage {

  public formshow: any = [];
  public lastTrans: String = '';
  public formulario: any = [
    {
      "required": true,
      "label": "Ingresa tu nombre",
      "type": "input"
    },
    {
      "required": true,
      "label": "Sabor que mas le gusta",
      "type": "select",
      "concurrence": false,
      "concurrence_value": 0,
      "concurrence_time": 0,
      "concurrence_now": 1,
      "data": [
        {
          "label": "Mango",
          "value": "1",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "Mandarina",
          "value": "2",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "Manzana",
          "value": "3",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        }
      ]
    },
    {
      "required": true,
      "label": "Mide tu nivel de experiencia",
      "type": "radio",
      "concurrence": false,
      "concurrence_value": 0,
      "concurrence_time": 0,
      "concurrence_now": 1,
      "data": [
        {
          "label": "Muy Mala",
          "value": "1",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "Mala",
          "value": "2",
          "concurrence": false,
          "concurrence_value": 0,
          "concurrence_time": 0,
          "concurrence_now": 0,
          "state": true
        },
        {
          "label": "Buena",
          "value": "3",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "Muy buena",
          "value": "4",
          "concurrence": false,
          "concurrence_value": 0,
          "concurrence_time": 0,
          "concurrence_now": 0,
          "state": true
        }
      ]
    },
    {
      "required": true,
      "label": "Sabor que mas le gusta",
      "type": "select",
      "concurrence": false,
      "concurrence_value": 0,
      "concurrence_time": 0,
      "concurrence_now": 1,
      "data": [
        {
          "label": "Mango",
          "value": "1",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "Mandarina",
          "value": "2",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "Manzana",
          "value": "3",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        }
      ]
    },
    {
      "required": true,
      "label": "Selecciona una o mas Opciones",
      "type": "boxes",
      "concurrence": true,
      "concurrence_value": 0,
      "concurrence_time": 0,
      "concurrence_now": 1,
      "data": [
        {
          "label": "Esta es la opcion una",
          "value": "1",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "La opcion numero dos",
          "value": "2",
          "concurrence": false,
          "concurrence_value": 0,
          "concurrence_time": 0,
          "concurrence_now": 0,
          "state": true
        },
        {
          "label": "Esta es la opcion numero tres",
          "value": "3",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "Esta es la opcion numero 4",
          "value": "4",
          "concurrence": false,
          "concurrence_value": 0,
          "concurrence_time": 0,
          "concurrence_now": 0,
          "state": true
        }
      ]
    },
    {
      "required": true,
      "label": "Selecciona una o mas Opciones",
      "type": "input",
      
    },
    {
      "required": true,
      "label": "Selecciona una o mas Opciones",
      "type": "input"
    },
    {
      "required": true,
      "label": "Que piensas de jerry lagos",
      "type": "radio",
      "concurrence": false,
      "concurrence_value": 0,
      "concurrence_time": 0,
      "concurrence_now": 1,
      "data": [
        {
          "label": "Muy Mala",
          "value": "1",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "Mala",
          "value": "2",
          "concurrence": false,
          "concurrence_value": 0,
          "concurrence_time": 0,
          "concurrence_now": 0,
          "state": true
        },
        {
          "label": "Buena",
          "value": "3",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "Muy buena",
          "value": "4",
          "concurrence": false,
          "concurrence_value": 0,
          "concurrence_time": 0,
          "concurrence_now": 0,
          "state": true
        }
      ]
    },
    {
      "required": true,
      "label": "otro ejemplo de boxes",
      "type": "boxes",
      "concurrence": true,
      "concurrence_value": 0,
      "concurrence_time": 0,
      "concurrence_now": 1,
      "data": [
        {
          "label": "Esta es la opcion una",
          "value": "1",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "La opcion numero dos",
          "value": "2",
          "concurrence": false,
          "concurrence_value": 0,
          "concurrence_time": 0,
          "concurrence_now": 0,
          "state": true
        },
        {
          "label": "Esta es la opcion numero tres",
          "value": "3",
          "concurrence": true,
          "concurrence_value": 4,
          "concurrence_time": 24,
          "concurrence_now": 1,
          "state": true
        },
        {
          "label": "Esta es la opcion numero 4",
          "value": "4",
          "concurrence": false,
          "concurrence_value": 0,
          "concurrence_time": 0,
          "concurrence_now": 0,
          "state": true
        }
      ]
    },
    {
      "label": "This is my enunciates",
      "type": "title"
    },
    {
      "required": true,
      "label": "Toma una fotografia",
      "type": "photo"
    }
  ];


  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public formBuilder: FormBuilder
      ) {
        console.log("funciono");
  }

  validate_response(element) {
    return element == undefined || element == '' || element == null;
  }

  sendForm() {
    for (let e = 0; e < this.formulario.length; e++) {
      
      this.formulario[e].error = false;
      if(this.formulario[e].type == 'boxes'){
        let cnt = 0;
        this.formulario[e].data.forEach(element => {
            if(this.validate_response(element.response)){
              this.formulario[e].error = true;              
            } else if(element.response) {
              cnt++;
            }
          });
          
          if(cnt > 0) {
            this.formulario[e].error = false;         
          }
      } else {
        
        if(this.formulario[e].required == true && this.validate_response(this.formulario[e].response)) {
          this.formulario[e].error = true;
        }

      }
      
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormPage');
  }

}
