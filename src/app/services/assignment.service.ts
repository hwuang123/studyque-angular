import { Injectable } from '@angular/core';
import { FilterRequest } from './../shared/filter-request';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
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

   saveAssignment(assignmentObj: Object): Observable<Object> {
    this.errorMsg = " save Assignment from Service "
    return this.http.post(`${this.baseUrl}/addAssignment`, assignmentObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updateAssignment(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Assignment from Service ";
    //return this.http.put(`${this.baseUrl}/${id}`, value);
    return this.http.put(`${this.baseUrl}/assignment/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deleteAssignment(id: number): Observable<any> {
    this.errorMsg = " delete Assignment from Service "
    return this.http.delete(`${this.baseUrl}/assignment/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getAssignmentList(): Observable<any> {
    this.errorMsg = " get Assignment List from Service ";
    return this.http.get(`${this.baseUrl}/getAssignments`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }


}
