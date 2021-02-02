import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    console.log(data.date);
    return this.http.put(environment.apiRoot + '/tennis/reservations', data);
  }
  cancel(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/reservations', data);
  }
}
