import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ShareService } from './share.service';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl:any;
  errorMsg = "";
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
 });
 options = {
    headers: this.headers
 }

  constructor(private http: HttpClient, private shareService: ShareService) {
    this.baseUrl = this.shareService.url + 'studyque/admin';
   }

   createTerm(alertObj: Object): Observable<Object> {
    this.errorMsg = " create Term from Service "
    return this.http.post(`${this.baseUrl}/createTerm`, alertObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updateTerm(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Term from Service ";
    return this.http.put(`${this.baseUrl}/updateTerm/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deleteTerm(id: number): Observable<any> {
    this.errorMsg = " delete Term from Service "
    return this.http.delete(`${this.baseUrl}/deleteTerm/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getAllTerms(): Observable<any> {
    this.errorMsg = " get Term List from Service ";
    return this.http.get(`${this.baseUrl}/getAllTerms`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }


}
