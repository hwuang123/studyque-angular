import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ShareService } from './share.service';

// const AUTH_API = 'http://localhost:8083/RESTful/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_API:any; 
constructor(private http: HttpClient, private shareService: ShareService) {
  this.AUTH_API = this.shareService.url + 'api/auth/';
 }

  login(credentials): Observable<any> {
    return this.http.post(this.AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  email(emailObj): Observable<Object> {
   // return this.http.post(this.AUTH_API + 'email', emailObj);
   return this.http.post(this.AUTH_API + 'email', emailObj).pipe(
    catchError((err) => {
      console.log('error caught in service')
      console.error(err);
      //Handle the error here
      return throwError(err);    //Rethrow it back to component
    })
  );
  }

  forgetUserName(emailObj): Observable<Object> {
    // return this.http.post(this.AUTH_API + 'email', emailObj);
    return this.http.post(this.AUTH_API + 'forgetUserName', emailObj).pipe(
     catchError((err) => {
       console.log('error caught in service')
       console.error(err);
       //Handle the error here
       return throwError(err);    //Rethrow it back to component
     })
   );
   }
 
   getVerificationCode(emailObj): Observable<Object> {
    // return this.http.post(this.AUTH_API + 'email', emailObj);
    return this.http.post(this.AUTH_API + 'getVerificationCode', emailObj).pipe(
     catchError((err) => {
       console.log('error caught in service')
       console.error(err);
       //Handle the error here
       return throwError(err);    //Rethrow it back to component
     })
   );
   }

   emailUserName(emailObj): Observable<Object> {
    // return this.http.post(this.AUTH_API + 'email', emailObj);
    return this.http.post(this.AUTH_API + 'emailUserName', emailObj).pipe(
     catchError((err) => {
       console.log('error caught in service')
       console.error(err);
       //Handle the error here
       return throwError(err);    //Rethrow it back to component
     })
   );
   }

   sendEmailForgetPassword(emailObj): Observable<Object> {
    // return this.http.post(this.AUTH_API + 'email', emailObj);
    return this.http.post(this.AUTH_API + 'sendEmailForgetPassword', emailObj).pipe(
      catchError((err) => {
       console.log('error caught in service')
       console.error(err);
       //Handle the error here
       return throwError(err);    //Rethrow it back to component
      })
    );
   }

   emailResetPassword(emailObj): Observable<Object> {
    // return this.http.post(this.AUTH_API + 'email', emailObj);
    return this.http.post(this.AUTH_API + 'emailResetPassword', emailObj).pipe(
      catchError((err) => {
       console.log('error caught in service')
       console.error(err);
       //Handle the error here
       return throwError(err);    //Rethrow it back to component
      })
    );
   }

   resetPassword(emailObj): Observable<Object> {
    // return this.http.post(this.AUTH_API + 'email', emailObj);
    return this.http.post(this.AUTH_API + 'resetPassword', emailObj).pipe(
      catchError((err) => {
       console.log('error caught in service')
       console.error(err);
       //Handle the error here
       return throwError(err);    //Rethrow it back to component
      })
    );
   }

  register(user): Observable<any> {
    return this.http.post(this.AUTH_API + 'signup', {
      username: user.username,
      // email: user.email,
      password: user.password
    }, httpOptions);
  }
}
