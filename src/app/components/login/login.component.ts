import { FireBaseService } from './../../services/fire-base.service';
import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from 'angularx-social-login';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loginMessage: string;
  userRole: number;
  refreshIdToken = '';
  customToken = '';

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private fireBaseService: FireBaseService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => {
      if (authState) {
        this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl || '/profile');

      } else {
        this.router.navigateByUrl('/login');
      }
    });


  }


  signInWithGoogle() {
    this.userService.googleLogin();
  }
  

  login(form: NgForm) {
    const email = this.email;
    const password = this.password;

    if (form.invalid) {
      return;
    }

    form.reset();
    this.userService.loginUser(email, password).subscribe((data: any) => {
      this.refreshIdToken = data.model.refreshIdToken;
      localStorage.setItem('refreshIdToken', this.refreshIdToken);
      this.userService.getAuThorizationToken(this.refreshIdToken).subscribe((aData: any) => {
        this.userService.loginMessage$.next('');
        this.customToken = aData.model.customToken; //send custom token to firebase to get auth token
        localStorage.setItem('customToken', this.customToken);
        this.fireBaseService.validateToken(this.customToken);
        this.userService.setRoleInApp();
        this.router.navigateByUrl('');
      }, (err) => {
        this.userService.loginMessage$.next(err.error.message);
        this.userService.userRoleName$.next('');
      });
  }, (err)=> {
    this.userService.loginMessage$.next(err.error.message);
    this.userService.userRoleName$.next('');
  });

    this.userService.loginMessage$.subscribe(msg => {
      this.loginMessage = msg;
      setTimeout(() => {
        this.loginMessage = '';
      }, 2000);
    });


  }
}
