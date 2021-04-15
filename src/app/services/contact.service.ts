import { Injectable } from '@angular/core';
import { FilterRequest } from './../shared/filter-request';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl:any;
  errorMsg = "";
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
 });
 options = {
    headers: this.headers
 }

  constructor(private http: HttpClient, private shareService: ShareService) { 
    this.baseUrl = this.shareService.url + 'studyque';
  }

  getContactListByStudentId(id: number): Observable<any> {
    this.errorMsg = " get Contact List from Service ";
    return this.http.get(`${this.baseUrl}/getContactListByStudentId/${id}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }

}
