import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authToken = localStorage.getItem("authTokenForBkened");
    const headerDict = {
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': '',
        'sec-fetch-site': 'cross-site',
        'Authorization': 'Bearer '+authToken
    }
    
    request = request.clone({
        headers: new HttpHeaders(headerDict)
    });
    return next.handle(request);
  }
}