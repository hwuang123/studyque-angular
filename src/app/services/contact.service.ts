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

  getStudentOnlyContactList(id: number): Observable<any> {
    this.errorMsg = " get Contact List from Service ";
    return this.http.get(`${this.baseUrl}/getStudentOnlyContactList/${id}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }

  getContactListByGuardianId(id: number): Observable<any> {
    this.errorMsg = " get Contact List by guaridan ID from Service ";
    return this.http.get(`${this.baseUrl}/getContactListByGuardianId/${id}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }

  getContactList(): Observable<any> {
    this.errorMsg = " get Contact List from Service ";
    return this.http.get(`${this.baseUrl}/getContacts`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }

  saveContact(obj: Object): Observable<Object> {
    this.errorMsg = " save Contact from Service "
    return this.http.post(`${this.baseUrl}/addContact`, obj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updateContact(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Contact from Service ";
    //return this.http.put(`${this.baseUrl}/${id}`, value);
    return this.http.put(`${this.baseUrl}/updateContact/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deleteContact(id: number): Observable<any> {
    this.errorMsg = " delete Contact from Service "
    return this.http.delete(`${this.baseUrl}/deleteContact/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }



}
