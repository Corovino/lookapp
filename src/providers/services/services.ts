import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  // private endApi = "http://localhost:8080/api/v1";

  // private endApi = this.ends.FUNC_END_POINT_TO_API();
  // private endAuth = this.ends.FUNC_END_POINT_AUTHORIZATION();
  // private endAuth = 'Bearer {"id":"110546993488738742297","d":"2","user":1,"type":"iwgl","accesToken":{"code":0,"user":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MzkxNDE5ODMsImV4cCI6MTU0MDE0MTk4MywiZGF0YSI6eyJpZCI6IjExMDU0Njk5MzQ4ODczODc0MjI5NyIsIm5hbWUiOiJqZXJyeSIsImxuYW1lIjoibGFnb3MiLCJjb3JyZW8iOiJqZXJyeXNlYmFzdGlhbmxhZ29zY0BnbWFpbC5jb20iLCJkb21haW4iOiIyIn19.Qogh9xlFk2Xn79jmjUUlKIbDAY51MX269H7BeyyJmQE"}}';
  
  
  get_points_available(id) {
    return this.http.get(`${this.endApi}/get_points_available/${id}`);
  }
  
  // LAS PALABRA RESERVADA PARA HACER EL CONSUMO DELA API ES REST
  changepass(data: any) {
    return this.http.post(`${this.endApi}/resetpass`, data);
  }

  // API PARA ENVIAR CORREO DE CAMBIO DE CONTRASEÑA
  rend_mail_to_reset(data) {
    return this.http.post(`${this.endApi}/send_mail`, data);
  }

  setLogin(data: any) {
    return this.http.post(`${this.endApi}/login_eyes`, data);
  }

  // traer los estudios disponible para el sistema
  get_studies_available() {
    return this.http.get(`${this.endApi}/studies_available`);
  }

  get_studies_test(id) {
    return this.http.get(`${this.endApi}/studies_test/${id}`);
  }

  save_last_modify_to_task(data, id) {
    return this.http.put(`${this.endApi}/save_last_modify_to_task/${id}`, data);
  }

  get_form_to_task(id) {
    return this.http.get(`${this.endApi}/get_form_to_task/${id}`);
  }
  get_studies_prueba(id) {
    return this.http.get(`${this.endApi}/studies_prueba/${id}`);
  }

  get_dept_to_userpayment(id) {
    return this.http.get(`${this.endApi}/get_dept_to_userpayment/${id}`);
  }
  //Proceso para quitar un punto del mapa que no ha sido equitado 
  hide_point(id, iduser) {
    return this.http.get(`${this.endApi}/hide_point/${id}/${iduser}`);
  }

  // METHOD TO UPUDATE INFO TO USER
  update_user(data: any, id: number) {
    return this.http.put(`${this.endApi}/update_user/${id}`, data);
  }

  // Proceso para consultar la existencia de un usuario
  validata_user(data: any) {
    return this.http.post(`${this.endApi}/validata_user`, data);
  }

  // procecso para la creacion de un usuario
  create_user_step_one(data: any) {
    return this.http.post(`${this.endApi}/create_user_step_one`, data);
  }

  create_user_step_two(data:any, id: number) {
    return this.http.put(`${this.endApi}/create_user_step_two/${id}`, data);
  }

  // VALID CODE
  valid_code(data){
    return this.http.post(`${this.endApi}/valid_code`, data);
  }

  save_img_user(data:any, id: number) {
    return this.http.put(`${this.endApi}/update_img_to_user/${id}`, data);
  }

  // THIS API IS CREATED TO SEND DATA WHEN A USER IS LOGGED WITH FACEBOOK

  points_to_tasks(id) {
    return this.http.get(`${this.endApi}/points_to_tasks/${id}` );
  }

  // FUNCTION TO CONNECTO LOGGIN TO A USER
  login_eyes(data) {
    return this.http.post(`${this.endApi}/login_eyes`, data);
  }
  
  // CONECTAR CON FACEBOKK
  connect_facebook(data) {
    return this.http.post(`${this.endApi}/connect_facebook`, data);
  }
  //  METHOD TO UPDATE INFO TO USER THAT INSIDE WITH FACEBOOKK
  upload_data_to_facebook(data){
    return this.http.post( `${this.endApi}/upload_data_to_facebook`, data);
  }


  know_available(data) {
    return this.http.post(`${this.endApi}/know_available`, data);
  }

  delete_selected(data) {
    return this.http.post(`${this.endApi}/delete_selected`, data)
  }

  //  METHOD TO UPDATE INFO TO USER THAT INSIDE WITH EMAIL AND ALREADY REGISTER IN SYSTEM
  upload_data_to_email(data) {
    return this.http.post(`${this.endApi}/upload_data_to_email`, data);
  }
  // PROCESO PARA TOMAR UNA TAREA
  take_task(data) {
    return this.http.post(`${this.endApi}/take_task`, data);
  }
  // update state to task
  update_task(data){
    return this.http.post(`${this.endApi}/update_form_response_to_task`, data);
  }
  // get all info to user
  get_info_user(id){
    return this.http.get(`${this.endApi}/get_info_user/${id}`);
  }
  // PROCESO PARA CONOCER LAS TAREAS ACEPTADAS, EN PROCESO, Y RECHAZADAS
  get_states_task(id) {
    return this.http.get(`${this.endApi}/get_all_task_by_id/${id}`);
  }

  // Traer informacion sobre un estudio
  get_studie(id) {
    return this.http.get(`${this.endApi}/get_studie/${id}`, { headers: this.getHeader() }  );
  }

  // Process to make this
  save_img_get_url(data) {
    return this.http.post(`${this.endApi}/save_img_to_form`, data);
  }

  // PROCESO TO SEND A  TASK
  save_task(data) {
    return this.http.post(`${this.endApi}/update_form_response_to_task`, data);
  }

  // CANCELAR UNA TAREA
  cancel_task(id: number) {
    return this.http.get(`${this.endApi}/cancel_task/${id}`);
  }

  //  FUNCIONES QUE NO TEINENE RELACION 
  private getHeader() {
    return new HttpHeaders().set("x-loap", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJfaWQiOjQ2LCJ1c2VyIjoiSmVycnkgTGFnb3NcbiIsImVtYWlsIjoiamVycnlAbG9va2FwcC5jb20uY28iLCJpYXQiOjE1NDU4NjQxODksImV4cCI6MTU0NTk1MDU4OX0.IFcD9mMBQkt1F1Dhq-QmPwS5pP7_0KN9-4Knrb0Djqtd7m6q2--9hAtch2kVJt0M");
  }


}
