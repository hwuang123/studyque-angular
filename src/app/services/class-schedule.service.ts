import { FilterRequest } from '../shared/filter-request';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassScheduleService {
  private classScheduleSaveUrl = 'http://localhost:8083/RESTful/studyque/addClassSchedule';
  private baseUrl = 'http://localhost:8083/RESTful/studyque';
  errorMsg = "";
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
 });
 options = {
    headers: this.headers
 }

  constructor(private http: HttpClient) { }

  saveClassdayOfWeek(classScheduleObj: Object): Observable<Object> {
    this.errorMsg = " saveClassSchedule from Service "
    return this.http.post(`${this.classScheduleSaveUrl}`, classScheduleObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updateClassdayOfWeek(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Class Schedule from Service "
    //return this.http.put(`${this.baseUrl}/${id}`, value);
    return this.http.put(`${this.baseUrl}/classschedule/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deleteClassdayOfWeek(id: number): Observable<any> {
    this.errorMsg = " delete Class Schedule from Service "
    return this.http.delete(`${this.baseUrl}/classschedule/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getClassdayOfWeekList(id: number): Observable<any> {
    this.errorMsg = " getClassScheduleList from Service ";
    return this.http.get(`${this.baseUrl}/classschedules/${id}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  
}
