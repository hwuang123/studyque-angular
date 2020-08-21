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
  private baseUrl = 'http://localhost:8083/RESTful/studyque';
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

  updateClassName(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Class Name from Service ";
    //return this.http.put(`${this.baseUrl}/${id}`, value);
    return this.http.put(`${this.baseUrl}/classnames/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getClassNameBeanById(id: number): Observable<Object> {
    this.errorMsg = " get Class Name from Service ";
    return this.http.get(`${this.baseUrl}/classnames/${id}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deleteClassName(id: number): Observable<any> {
    this.errorMsg = " delete Class Name from Service "
    return this.http.delete(`${this.baseUrl}/classnames/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getClassNameList(): Observable<any> {
    this.errorMsg = " getEmployeeList from Service ";
    return this.http.get(`${this.baseUrl}/classnames`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

}//End of class
