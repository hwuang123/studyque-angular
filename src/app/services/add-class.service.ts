import { FilterRequest } from './../shared/filter-request';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddClassService {
  private classNameSaveUrl = 'http://localhost:8083/RESTful/studyque/addclasses';
  errorMsg = "";
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
 });
 options = {
    headers: this.headers
 }
  constructor(private http: HttpClient) { }
  saveClassName(classNameObj: Object): Observable<Object> {
    this.errorMsg = " saveClassName from Service "
    return this.http.post(`${this.classNameSaveUrl}`, classNameObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

}
