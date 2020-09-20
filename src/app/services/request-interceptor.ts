import { NotificationService } from './notification.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { UserService } from './user.service';
import { FireBaseService } from './fire-base.service';
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService,
    private fireBaseService: FireBaseService,
    private userService: UserService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authToken = localStorage.getItem("authTokenForBkened");
    const headerDict = {
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': '',
        'sec-fetch-site': 'cross-site',
        'Authorization': 'Bearer '+authToken
    }
    if (request.method=='POST' || request.method=='PUT') {
      headerDict['Authorization'] = 'Bearer ' + localStorage.getItem('authTokenForBkened');
    }
    
    request = request.clone({
        headers: new HttpHeaders(headerDict)
    });
    if (this.fireBaseService.hasValidAuthToken()) {
                    
    }
    return next.handle(request).pipe(
      tap(evt => {
          if ((request.method=='POST' || request.method=='PUT') && evt instanceof HttpResponse) {
              if(evt.body && evt.body.code == '200') {
                this.notificationService.showSuccess(evt.body.model.msg, 'Success');
              }
            }
      }),
      catchError((err: any) => {
          if(err instanceof HttpErrorResponse) {
              try {
                if (err.error.code == '403') {
                  this.notificationService.showError(err.error.message, 'Error');
                  
                 /* this.userService.getAuThorizationToken(localStorage.getItem('refreshIdToken'))
                  .subscribe((aData: any) => {
                    let customToken = aData.model.customToken;;
                    this.userService.loginMessage$.next(''); //send custom token to firebase to get auth token
                    localStorage.setItem('customToken', customToken);
                    this.fireBaseService.validateToken(customToken);
                    this.userService.setRoleInApp();
                  }, (err) => {
                    this.userService.loginMessage$.next(err.error.message);
                    this.userService.userRoleName$.next('');
                  });*/
                } else {
                  this.notificationService.showError(err.error.message, 'Error');
                }
                 
              } catch(e) {
                this.notificationService.showError('An error occurred', 'Error');
              }
          }
          return of(err);
      }));
  }
}