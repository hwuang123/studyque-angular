import { FilterRequest } from './../shared/filter-request';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = 'http://localhost:8083/RESTful/api/v1/employees';
  private pagingUrl = 'http://localhost:8083/RESTful/api/v1/paging/employees';
  private employeeCountUrl = 'http://localhost:8083/RESTful/api/v1/count/employees';
  private employeeFilterUrl = 'http://localhost:8083/RESTful/api/v1/filter/employees';
  private employeeFilterCountUrl = 'http://localhost:8083/RESTful/api/v1/filter/count/employees';
  errorMsg = "";
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
 });
 options = {
    headers: this.headers
 }
  constructor(private http: HttpClient) { }

  getEmployee(id: number): Observable<any> {
    this.errorMsg = " getEmployee from Service "
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  createEmployee(employee: Object): Observable<Object> {
    this.errorMsg = " createEmployee from Service "
    return this.http.post(`${this.baseUrl}`, employee).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  updateEmployee(id: number, value: any): Observable<Object> {
    this.errorMsg = " updateEmployee from Service "
    //return this.http.put(`${this.baseUrl}/${id}`, value);
    return this.http.put(`${this.baseUrl}/${id}`, value).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  deleteEmployee(id: number): Observable<any> {
    this.errorMsg = " deleteEmployee from Service "
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getEmployeesList(): Observable<any> {
    this.errorMsg = " getEmployeeList from Service ";
    return this.http.get(`${this.baseUrl}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getEmployeesCount(): Observable<any> {
    this.errorMsg = " getEmployeeCount from Service ";
    return this.http.get(`${this.employeeCountUrl}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getPagingEmployeesList(pageNumber: number, pageSize: number): Observable<any> {
    this.errorMsg = " getPagingEmployeeList from Service ";
    let url = this.pagingUrl+"?pageNumber="+pageNumber+"&pageSize="+pageSize;
    return this.http.get(`${url}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }
  
  getFilterEmployeesList(pageNumber: number, pageSize: number, filterRequest: FilterRequest): Observable<any> {
    this.errorMsg = " getPagingEmployeeList from Service ";
    let url = this.employeeFilterUrl+"?pageNumber="+pageNumber
            +"&pageSize="+pageSize
            +"&filterRequest="+encodeURI(JSON.stringify(filterRequest));
    return this.http.get(`${url}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  getFilterEmployeesCount(filterRequest: FilterRequest): Observable<any> {
    this.errorMsg = " getPagingEmployeeList from Service ";
    let url = this.employeeFilterCountUrl+"?filterRequest="+encodeURI(JSON.stringify(filterRequest));
    return this.http.get(`${url}`).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);
        //Handle the error here
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

//   private getPutHeaders(){
//     let headers = new Headers();
//     headers.append('Content-Type', 'application/json');
//     return new RequestOptions({
//         headers: headers
//         , withCredentials: true // optional when using windows auth
//     });
// }
}


