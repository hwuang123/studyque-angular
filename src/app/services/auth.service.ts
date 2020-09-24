import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  register(user): Observable<any> {
    return this.http.post(this.AUTH_API + 'signup', {
      username: user.username,
      // email: user.email,
      password: user.password
    }, httpOptions);
  }
}
