import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { _throw } from 'rxjs/observable/throw';
import { catchError, mergeMap } from 'rxjs/operators';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public storage: Storage) {

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    request = request.clone({ headers: request.headers.set('x-loap', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJfaWQiOjYyLCJ1c2VyIjoiRnVsYW5pdG8iLCJlbWFpbCI6ImZ1bGFuaXRvQGZ1bGFuaXRvLmNvbSIsImlhdCI6MTU0NjAwNjAzOSwiZXhwIjoxNTQ2MDkyNDM5fQ.PvGY2_z-e7k68UDpTssJ6VCnkXOvZeFvYbE0o68ammVVhALL9zAE33qxaiThk3si') });
    this.storage.get("xx-app-loap");
    return next.handle(request);

  }

}