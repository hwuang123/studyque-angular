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

   getRolePrivileges(alertObj: Object): Observable<Object> {
    this.errorMsg = " get RolePrivileges from Service "
    return this.http.post(`${this.baseUrl}/getRolePrivileges`, alertObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  saveRolePrivileges(alertObj: Object): Observable<Object> {
    this.errorMsg = " save RolePrivileges from Service "
    return this.http.post(`${this.baseUrl}/saveRolePrivileges`, alertObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
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

  createMethod(alertObj: Object): Observable<Object> {
    this.errorMsg = " create Term from Service "
    return this.http.post(`${this.baseUrl}/createMethod`, alertObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  createPrivilege(alertObj: Object): Observable<Object> {
    this.errorMsg = " create privilege from Service "
    return this.http.post(`${this.baseUrl}/createPrivilege`, alertObj).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  createRole(alertObj: Object): Observable<Object> {
    this.errorMsg = " create role from Service "
    return this.http.post(`${this.baseUrl}/createRole`, alertObj).pipe(
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

  updateMethod(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Method from Service ";
    return this.http.put(`${this.baseUrl}/updateMethod/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updatePrivilege(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Privilege from Service ";
    return this.http.put(`${this.baseUrl}/updatePrivilege/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updateRole(id: number, value: any): Observable<Object> {
    this.errorMsg = " update Role from Service ";
    return this.http.put(`${this.baseUrl}/updateRole/${id}`, value).pipe(
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

  deleteMethod(id: number): Observable<any> {
    this.errorMsg = " delete Method from Service "
    return this.http.delete(`${this.baseUrl}/deleteMethod/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deletePrivilege(id: number): Observable<any> {
    this.errorMsg = " delete Privilege from Service "
    return this.http.delete(`${this.baseUrl}/deletePrivilege/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deleteRole(id: number): Observable<any> {
    this.errorMsg = " delete Role from Service "
    return this.http.delete(`${this.baseUrl}/deleteRole/${id}`, { responseType: 'text' }).pipe(
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

  getAllMethods(): Observable<any> {
    this.errorMsg = " get Method List from Service ";
    return this.http.get(`${this.baseUrl}/getAllMethods`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  } 

  getAllPrivileges(): Observable<any> {
    this.errorMsg = " get Privilege List from Service ";
    return this.http.get(`${this.baseUrl}/getAllPrivileges`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  } 

  getAllRoles(): Observable<any> {
    this.errorMsg = " get Role List from Service ";
    return this.http.get(`${this.baseUrl}/getAllRoles`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    ); 
  } 

}
