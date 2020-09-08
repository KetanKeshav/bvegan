import { UserService } from '@app/services/user.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  constructor(private router: Router,
    private userService: UserService,
    private route: ActivatedRoute) {  
    firebase.initializeApp({
    apiKey: "AIzaSyAdwunBj77RDWtLZd8uSwTvVB0jSxbNjLI",
    authDomain: "bvegan-29e44.firebaseapp.com",
    databaseURL: "https://bvegan-29e44.firebaseio.com",
    projectId: "bvegan-29e44",
    storageBucket: "bvegan-29e44.appspot.com",
    messagingSenderId: "936561377811",
    appId: "1:936561377811:web:8a7ad535db4766945775e6",
    measurementId: "G-5PS3BBJXDK"
  });
}
public validateToken(backendToken) {
   
    var auth = firebase.auth();
    auth.signInWithCustomToken(backendToken)
    .then(s=>{
      this.userService.loginMessage$.next('');
    })
    .catch(function(error) {                            
      var errorCode = error.code;
      var errorMessage = error.message;                            
      if (errorCode === 'auth/invalid-custom-token') {
        this.router.navigateByUrl('/login');
        this.userService.loginMessage$.next('Please Sign In');
        console.error("invalid token");
      } else {
        console.error("error");
      }                         
    });
    auth.onIdTokenChanged(function(user) {
      if (user) {
        user.getIdToken().then(
          token => {           
            console.log('updated Sai');                             
            localStorage.setItem("authTokenForBkened", token);
          }
        )
      }  
    });
 }

}
