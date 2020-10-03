import {Injectable} from '@angular/core';
import {AuthService, GoogleLoginProvider, SocialUser} from 'angularx-social-login';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth = false;
  private SERVER_URL = environment.SERVER_URL;
  private user;
  userRoleName$ = new BehaviorSubject<string>(null);
  authState$ = new BehaviorSubject<boolean>(this.auth);
  userData$ = new BehaviorSubject<SocialUser | ResponseModel | object>(null);
  loginMessage$ = new BehaviorSubject<string>(null);
  userRole: number;

  constructor(private authService: AuthService,
              private httpClient: HttpClient) {

    /*authService.authState.subscribe((user: SocialUser) => {
      if (user != null) {
        this.httpClient.get(`${this.SERVER_URL}/users/validate/${user.email}`).subscribe((res: { status: boolean, user: object }) => {
          //  No user exists in database with Social Login
          if (!res.status) {
            // Send data to backend to register the user in database so that the user can place orders against his user id
            this.registerUser({
              email: user.email,
              fname: user.firstName,
              lname: user.lastName,
              password: '123456'
            }).subscribe(response => {
              if (response.message === 'Registration successful') {
                this.auth = true;
                this.userRole = 555;
                this.authState$.next(this.auth);
                this.userData$.next(user);
              }
            });

          } else {
            this.auth = true;
            // @ts-ignore
            this.userRole = res.user.role;
            this.authState$.next(this.auth);
            this.userData$.next(res.user);
          }
        });

      }
    });*/
  }

  resendOtp(otpObject) {
    return this.httpClient.post(`${this.SERVER_URL}/resend-otp`, otpObject);
  }

  validateOtp(otpObject: any) {
    return this.httpClient.post(`${this.SERVER_URL}/validate-otp`, otpObject);
  }

  //  Login User with Email and Password
  loginUser(emailId: string, password: string) {
    return this.httpClient.post(`${this.SERVER_URL}/login`, {emailId, password});
  }

  getDecodedJWTToken() {
    if(localStorage.getItem('customToken')) {
      return JSON.parse(atob(localStorage.getItem('customToken').split('.')[1]));
    }
  }

  getAuThorizationToken(refreshIdToken: string) {
    return this.httpClient.post(`${this.SERVER_URL}/authorization-token`, {refreshIdToken});
  }

  setRoleInApp() {
    let decodedJwt = this.getDecodedJWTToken();
    this.userRoleName$.next(decodedJwt?.claims?.role);
  }

  getRoleName() {
    return this.getDecodedJWTToken()?.claims?.role;
  }
//  Google Authentication
  googleLogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logout() {
    this.authService.signOut();
    this.auth = false;
    this.authState$.next(this.auth);
  }

  registerUser(formData: any): Observable<{ message: string }> {
    const {name, mobile, email, password} = formData;
    let userObj = {name, mobile, email, password}; 
    userObj['fcmToken']='test';
    
    return this.httpClient.post<{ message: string }>(`${this.SERVER_URL}/sign-up/user`, userObj);
  }


}


export interface ResponseModel {
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
  type: string;
  role: number;
}
