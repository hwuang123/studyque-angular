import { FilterRequest } from './../shared/filter-request';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssignmentTypeService {
  private baseUrl = 'http://localhost:8083/RESTful/studyque';
  errorMsg = "";
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
 });
 options = {
    headers: this.headers
 }
  constructor(private http: HttpClient) { }

  saveAssignmentType(assignmentTypeObj: Object): Observable<Object> {
    this.errorMsg = " save Assignment Type from Service "
    return this.http.post(`${this.baseUrl}/addAssignmentType`, assignmentTypeObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updateAssignmentType(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Assignment Type from Service ";
    //return this.http.put(`${this.baseUrl}/${id}`, value);
    return this.http.put(`${this.baseUrl}/assignmentType/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deleteAssignmentType(id: number): Observable<any> {
    this.errorMsg = " delete Assignment Type from Service "
    return this.http.delete(`${this.baseUrl}/assignmentType/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getAssignmentTypeList(): Observable<any> {
    this.errorMsg = " get Assignment Type List from Service ";
    return this.http.get(`${this.baseUrl}/getAssignmentTypes`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

}
