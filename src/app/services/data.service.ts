import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private otpToken = new BehaviorSubject('');
  currentOtpToken = this.otpToken.asObservable();

  constructor() { }

  updateBkendTokenForOtp(bkendTokenForOtp: string) {
    this.otpToken.next(bkendTokenForOtp)
  }
}
