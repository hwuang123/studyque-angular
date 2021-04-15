import { Injectable } from '@angular/core';
import { FilterRequest } from './../shared/filter-request';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
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

  saveAlert(alertObj: Object): Observable<Object> {
    this.errorMsg = " save Alert from Service "
    return this.http.post(`${this.baseUrl}/addAlert`, alertObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updateAlert(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Alert from Service ";
    //return this.http.put(`${this.baseUrl}/${id}`, value);
    return this.http.put(`${this.baseUrl}/updateAlert/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deleteAlert(id: number): Observable<any> {
    this.errorMsg = " delete Alert from Service "
    return this.http.delete(`${this.baseUrl}/deleteAlert/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getAlertList(): Observable<any> {
    this.errorMsg = " get Alert List from Service ";
    return this.http.get(`${this.baseUrl}/getAlerts`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }

  getAlertListByStudentId(id: number): Observable<any> {
    this.errorMsg = " get Alert List from Service ";
    return this.http.get(`${this.baseUrl}/getAlertListByStudentId/${id}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }

  getMethodList(): Observable<any> {
    this.errorMsg = " get Method List from Service ";
    return this.http.get(`${this.baseUrl}/getMethods`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }

  searchAlertList(searchAlertObj: Object): Observable<any> {
    this.errorMsg = " get Alert List from Service ";
    return this.http.post(`${this.baseUrl}/searchAlerts`, searchAlertObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }


}
