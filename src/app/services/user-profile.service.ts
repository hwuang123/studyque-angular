import { FilterRequest } from './../shared/filter-request';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  // private userProfileSaveUrl = 'http://localhost:8083/RESTful/register/userprofile';
  private userProfileSaveUrl:any;

  errorMsg = "";
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
 });
 options = {
    headers: this.headers
 }
  constructor(private http: HttpClient, private shareService: ShareService) {
    this.userProfileSaveUrl = this.shareService.url + 'register/userprofile';
  //  this.userProfileSaveUrl = 'http://Studyque-env-2.eba-nxupp7m2.us-east-2.elasticbeanstalk.com/register/userprofile';
   }

   getAllTerms(): Observable<any> {
    this.errorMsg = " get Term List from Service ";
    return this.http.get(`${this.shareService.url}`+'register/getAllTerms').pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  }
  
 saveUserProfile(userProfile: Object): Observable<Object> {
    this.errorMsg = " saveUserProfile from Service "
    return this.http.post(`${this.userProfileSaveUrl}`, userProfile).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updateUserProfile(userProfile: Object): Observable<Object> {
    this.errorMsg = " saveUserProfile from Service "
    return this.http.put(`${this.shareService.url}`+'register/updateUserProfile', userProfile).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  changePassword(changePassword: Object): Observable<Object> {
    this.errorMsg = " Change Password "
    return this.http.post(`${this.shareService.url}`+'register/changepassword', changePassword).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );   
  }

getUserProfile(): Observable<Object> {
    this.errorMsg = " getUserProfile from Service "
    return this.http.get(`${this.shareService.url}`+'register/getUserProfile').pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }
}
