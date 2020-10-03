import { UserService } from '@app/services/user.service';
import { DataService } from './../../services/data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'firebase';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otpvalidation',
  templateUrl: './otpvalidation.component.html',
  styleUrls: ['./otpvalidation.component.scss']
})
export class OtpvalidationComponent implements OnInit {
  public otpToken='';
  @ViewChild('ngOtpInput') ngOtpInputRef:any;

  constructor(private dataService: DataService, 
    private userService: UserService,
    private router: Router) { 
  }


 

  ngOnInit(): void {
    this.dataService.currentOtpToken.subscribe(otpToken => {
      this.otpToken = otpToken;
      
    })
  }

  validateOtp() {
    let otp = this.ngOtpInputRef.otpForm.value.ctrl_0 + this.ngOtpInputRef.otpForm.value.ctrl_1 + 
    this.ngOtpInputRef.otpForm.value.ctrl_2 + this.ngOtpInputRef.otpForm.value.ctrl_3 +
    this.ngOtpInputRef.otpForm.value.ctrl_4 + this.ngOtpInputRef.otpForm.value.ctrl_5;
    this.userService.validateOtp({'otpToken':this.otpToken, 'otp':otp}).subscribe((msg:any)=>{
      this.router.navigateByUrl('/');
    });
    
  }

  
  resendOtp() {
    this.userService.resendOtp({'otpToken': this.otpToken}).subscribe((msg:any)=>{
      this.dataService.updateBkendTokenForOtp(msg.model);
    });;
  }

  onOtpChange(evt) {
    this.ngOtpInputRef.setValue(evt);
  }
 

}
