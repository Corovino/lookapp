import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/timeout'; // Don't forget this import, otherwise not gonna work
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';



/*
  Generated class for the ServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicesProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ServicesProvider Provider');
  }

  // private endSite = this.ends.FUNC_END_POINT_TO_SITE();
  private endApi = "http://node-express-env.eifgkdzath.us-west-2.elasticbeanstalk.com/api/v1";

  // private endApi = this.ends.FUNC_END_POINT_TO_API();
  // private endAuth = this.ends.FUNC_END_POINT_AUTHORIZATION();
  // private endAuth = 'Bearer {"id":"110546993488738742297","d":"2","user":1,"type":"iwgl","accesToken":{"code":0,"user":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MzkxNDE5ODMsImV4cCI6MTU0MDE0MTk4MywiZGF0YSI6eyJpZCI6IjExMDU0Njk5MzQ4ODczODc0MjI5NyIsIm5hbWUiOiJqZXJyeSIsImxuYW1lIjoibGFnb3MiLCJjb3JyZW8iOiJqZXJyeXNlYmFzdGlhbmxhZ29zY0BnbWFpbC5jb20iLCJkb21haW4iOiIyIn19.Qogh9xlFk2Xn79jmjUUlKIbDAY51MX269H7BeyyJmQE"}}';
  
  // LAS PALABRA RESERVADA PARA HACER EL CONSUMO DELA API ES REST


  setLogin(data: any) {
    return this.http.post(this.genUrl('login_eyes'), data);
  }

  get_studies_available() {
    return this.http.get(this.genUrl('studies_available'));
  }

  // Proceso para consultar la existencia de un usuari 
  validata_user(data: any) {
    return this.http.post(this.genUrl('validata_user'), data);
  }

  // procecso para la creacion de un usuario
  create_user_step_one(data: any) {
    return this.http.post(this.genUrl('create_user_step_one'), data);
  }

  create_user_step_two(data:any, id: number) {
    // return this.http.put(`http://localhost:8080/api/v1/create_user_step_two/${id}`, data);
    return this.http.put(this.genUrl(`create_user_step_two/${id}`), data);
  }

  save_img_user(data:any, id: number) {
    // return this.http.put(`http://localhost:8080/api/v1/update_img_to_user/${id}`, data);
    return this.http.put(this.genUrl(`update_img_to_user/${id}`), data);
  }

  login_eyes(data) {
    return this.http.post(this.genUrl('login_eyes'), data);
  }

  connect_facebook(data) {
    return this.http.post(this.genUrl('connect_facebook'), data);
  }


  // PROCESO PARA TOMAR UNA TAREA
  take_task(data) {
    return this.http.post(this.genUrl('take_task'), data);
  }

  // update state to task
  update_task(data){
    return this.http.post(this.genUrl('update_form_response_to_task'), data);
  }

  // get all info to user
  get_info_user(id){
    return this.http.get(this.genUrl(`get_info_user/${id}`));
  }
  // PROCESO PARA CONOCER LAS TAREAS ACEPTADAS, EN PROCESO, Y RECHAZADAS
  get_states_task(id) {
    return this.http.get(this.genUrl(`get_all_task_by_id/${id}`));
  }

  // Traer informacion sobre un estudio
  get_studie(id) {
    return this.http.get(this.genUrl(`get_studie/${id}`), { headers: this.getHeader() }  );
  }



  // //trae el listado de productos del sistema
  // getProducts() {
  //   return this.http.post(this.gemUrl('postproduct'), {}, { headers: this.getHeader() });
  // }

  // // Me permite enviar un like y asignarlo con un producto
  // setLike(req) {
  //   return this.http.post(this.gemUrl('setLikeProducto'), req, { headers: this.getHeader() });
  // }

  // // Función para agregar al carrito de compra
  // setBuy(req) {
  //   return this.http.post(this.gemUrl('cc_c_carbuy'), req, { headers: this.getHeader() });
  // }
  // // Proceso para traer el listado de productos en el carritio de compras
  // getInfoCar(req) {
  //   return this.http.post(this.gemUrl('getInfoCar'), req, { headers: this.getHeader() });
  // }
  // // Proceso para actualizar la cantidad de itenes que tiene un producto
  // u_cc_c_carbuy(req) {
  //   return this.http.post(this.gemUrl('u_cc_c_carbuy'), req, { headers: this.getHeader() });
  // }
  // // proceso para eliminar un producto del carritto de compras
  // updatecar(req) {
  //   return this.http.post(this.gemUrl('updatecar'), req, { headers: this.getHeader() });
  // }
  // // funcion para traer el cartido
  // getCar(req) {
  //   return this.http.post(this.gemUrl('getCar'), req, { headers: this.getHeader() })
  // }
  // // Proceso para traer informacion lista para realizar el pago
  // getInfoFactura() {
  //   var myData = JSON.stringify({ "id": "10213891993762092", "name": "Lagos Sebas" });
  //   return this.http.post(this.gemUrl('getInfoFactura'), myData, { headers: this.getHeader() })
  // }
  // // Funcion para hacer el pago
  // pay(req) {
  //   return this.http.post(this.gemUrl('5'), req, { headers: this.getHeader() })
  // }





  
  
  //  FUNCIONES QUE NO TEINENE RELACION 
  
  // funciones que me permite concatenar la url 
  private genUrl(url) {
    return `${this.endApi}/${url}`;
  }

  private getHeader() {
    return new HttpHeaders().set("x-loap", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJfaWQiOjQ2LCJ1c2VyIjoiSmVycnkgTGFnb3NcbiIsImVtYWlsIjoiamVycnlAbG9va2FwcC5jb20uY28iLCJpYXQiOjE1NDU4NjQxODksImV4cCI6MTU0NTk1MDU4OX0.IFcD9mMBQkt1F1Dhq-QmPwS5pP7_0KN9-4Knrb0Djqtd7m6q2--9hAtch2kVJt0M");
  }


}
