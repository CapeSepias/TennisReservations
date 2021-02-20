import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { ReservationsService } from '../services/reservations.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  memberFromDb: any;
  userMaint = true;
  courtMaint = false;
  loadError = '';
  data: any = {};
  email = new FormControl('', [Validators.required, Validators.email]);
  // tslint:disable-next-line: max-line-length
  maintenanceForCourts: any;
  constructor(private memberService: MemberService, private router: Router, private reservationsService: ReservationsService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('memberInfo') == null) {
      this.router.navigate(['login']);
    }
    this.reservationsService.getMaintenanceStatus().subscribe((resp) => {
      this.maintenanceForCourts = resp.maintenanceStatus;
      this.maintenanceForCourts.sort((a: any, b: any) => {
        return a.court - b.court;
      });
    });
  }

  // tslint:disable-next-line: typedef
  searchForUser() {
    this.loadError = '';
    this.data.enteredEmail = this.data.enteredEmail.toUpperCase();
    this.memberService.findMemberByEmail(this.data).subscribe((resp) => {
      this.memberFromDb = resp.user;
      this.memberFromDb.userRole = resp.role.rolename;
    }, (err) => {
      console.log(err);
      this.loadError = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // tslint:disable-next-line: typedef
  changeRole() {
    this.memberService.changeRole(this.memberFromDb).subscribe((resp) => {
      this.memberFromDb.userRole = resp.role;
      console.log(this.memberFromDb.userRole);
    }, (err) => {
      console.log(err);
      this.loadError = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  changeMaintenanceInfo(index: number) {
    this.maintenanceForCourts[index].inmaintenance = !this.maintenanceForCourts[index].inmaintenance;
    this.reservationsService.changeMaintenanceInfo({values: this.maintenanceForCourts[index], court: index + 1}).subscribe((resp) => {
      console.log('Maintenance info changed');
    }, (err) => {
      console.log(err);
      this.loadError = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  changeMaintenanceMessage(index: number) {
    this.reservationsService.changeMaintenanceInfo({values: this.maintenanceForCourts[index], court: index + 1}).subscribe((resp) => {
      console.log('Message changed');
    }, (err) => {
      console.log(err);
      this.loadError = err.error.error;
    });
  }

}
