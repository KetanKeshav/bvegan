import {Component, OnInit} from '@angular/core';
import {EmailValidator, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CheckEmailService} from '../../validators/check-email.service';
import {UserService} from '../../services/user.service';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [EmailValidator]
})
export class RegisterComponent implements OnInit {

  registrationForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  private emailPattern = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';
  comparePassword: boolean;
  registrationMessage: string;

  constructor(private fb: FormBuilder,
              private checkEmailService: CheckEmailService,
              private userService: UserService,
              private router: Router,
              private dataService: DataService) {

    this.registrationForm = fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      mobile: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]//,
       // [this.checkEmailService.emailValidate()]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get formControls() {
    return this.registrationForm.controls;
  }


  ngOnInit(): void {
    this.registrationForm.valueChanges
      .pipe(map((controls) => {
        return this.formControls.confirmPassword.value === this.formControls.password.value;
      }))
      .subscribe(passwordState => {
        console.log(passwordState);
        this.comparePassword = passwordState;
      });
  }

  registerUser() {

    // @ts-ignore
    this.userService.registerUser({...this.registrationForm.value}).subscribe((response: any) => {
      this.dataService.updateBkendTokenForOtp(response.model.otpToken);
      //this.registrationMessage = response.message;
      this.router.navigateByUrl('/otp-validation');
      
    });

    this.registrationForm.reset();
  }
}
