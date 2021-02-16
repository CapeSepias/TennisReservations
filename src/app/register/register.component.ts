import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  data: any = {};
  error = '';
  inputErrors = '';
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  regexpNumber: RegExp = new RegExp('^[a-zA-Z0-9.,!#]{6,14}$');

  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit(): void {
    this.memberService.getResidentId().subscribe((resp) => {
      this.data.role = resp.residentId.id;
    });
  }

  // tslint:disable-next-line: typedef
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.inputErrors = 'Email is required';
      return 'Email is required';
    } else {
      this.inputErrors = '';
    }
    this.inputErrors = this.email.hasError('email') ? 'Not a valid email' : '';
    return this.inputErrors;
  }

  // tslint:disable-next-line: typedef
  validateConfirmPassword() {
    if (this.data.enteredPassword !== this.data.confirmPassword) {
      this.inputErrors = 'Confirm Password needs to match';
    } else {
      this.inputErrors = '';
    }
  }

  // tslint:disable-next-line: typedef
  addUser() {
    this.error = '';
    // tslint:disable-next-line: max-line-length
    if (this.inputErrors === '' && this.data.enteredPassword && this.data.confirmPassword && this.data.enteredPassword === this.data.confirmPassword && this.data.enteredEmail && this.data.displayName && this.data.enteredPassword.length >= 6 && this.data.enteredPassword.length <= 14 && this.regexpNumber.test(this.data.enteredPassword)) {
      this.memberService.createUser(this.data).subscribe((resp) => {
        if (resp) {
          if (resp.updated) {
            console.log('User created!');
            this.router.navigate(['login']);
          } else {
            console.log(resp.error);
          }
        } else {
          console.log('Unknown error');
        }
      }, (err) => {
        console.log(err);
        this.error = err.error.error;
      });
    }
  }
}
