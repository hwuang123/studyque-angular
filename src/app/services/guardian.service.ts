import { Injectable } from '@angular/core';
import { FilterRequest } from './../shared/filter-request';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ShareService } from './share.service';


@Injectable({
  providedIn: 'root'
})
export class GuardianService {
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

  saveGuardian(guardianObj: Object): Observable<Object> {
    this.errorMsg = " save Guardian from Service "
    return this.http.post(`${this.baseUrl}/addGuardian`, guardianObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updateGuardian(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Guardian from Service ";
    //return this.http.put(`${this.baseUrl}/${id}`, value);
    return this.http.put(`${this.baseUrl}/updateGuardian/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deleteGuardian(id: number): Observable<any> {
    this.errorMsg = " delete Guardian from Service "
    return this.http.delete(`${this.baseUrl}/deleteGuardian/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getGuardianList(): Observable<any> {
    this.errorMsg = " get Guardian List from Service ";
    return this.http.get(`${this.baseUrl}/getGuardians`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }

  getGuardianListByStudentId(id: number): Observable<any> {
    this.errorMsg = " get Guardian List from Service ";
    return this.http.get(`${this.baseUrl}/getGuardianListByStudentId/${id}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }

}
