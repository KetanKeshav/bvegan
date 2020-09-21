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
    return new Observable<HttpEvent<any>>(subscriber => {

      // first try for the request
      next.handle(request)
          .subscribe((event: HttpEvent<any>) => {
                  if (event instanceof HttpResponse) {
                      // the request went well and we have valid response
                      // give response to user and complete the subscription
                      if ((request.method=='POST' || request.method=='PUT') && event instanceof HttpResponse) {
                        if(event.body && event.body.code == '200') {
                          this.notificationService.showSuccess(event.body.model.msg, 'Success');
                        }
                      }
                      subscriber.next(event);
                      subscriber.complete();
                  }
              },
              error => {
                  if (error instanceof HttpErrorResponse && error.status === 403
                    && localStorage.getItem('refreshIdToken') !=undefined
                    && localStorage.getItem('refreshIdToken').trim().length>0) {
                      console.log('403 error, trying to re-login');

                      // try to re-log the user
                      this.userService.getAuThorizationToken(localStorage.getItem('refreshIdToken')).
                      subscribe((aData: any) => {
                        let customToken = aData.model.customToken;
                        localStorage.setItem('customToken', customToken);
                        this.fireBaseService.validateToken(customToken);
                          // re-login successful -> create new headers with the new auth token
                          setTimeout(() => {
                            let newRequest = request.clone({
                              headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('authTokenForBkened'))
                          });

                          // retry the request with the new token
                          next.handle(newRequest)
                              .subscribe(newEvent => {
                                  if (newEvent instanceof HttpResponse) {
                                      // the second try went well and we have valid response
                                      // give response to user and complete the subscription
                                      subscriber.next(newEvent);
                                      subscriber.complete();
                                  }
                              }, error => {
                                  // second try went wrong -> throw error to subscriber
                                  this.notificationService.showError(error.error.message, 'Error');
                                  subscriber.error(error);
                              });
                          }, 500);
                          
                      });
                  } else {
                    this.notificationService.showError(error.error.message, 'Error');
                      // the error was not related to auth token -> throw error to subscriber
                      subscriber.error(error);
                  }
              });
  });

}

/**
* Try to re-login the user.
*/
  private reLogin(): Observable<string> {
    return ;
  }
}