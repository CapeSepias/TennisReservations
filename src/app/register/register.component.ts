import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  data: any = {};
  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  addUser() {
    this.memberService.checkUserIsValid(this.data).subscribe((resp) => {
      if (resp.length === 1) {
        console.log('User is valid!');
      } else {
        console.log('Could not find email or password');
      }
    }, (err) => {
      console.log(err);
    });
  }
}
