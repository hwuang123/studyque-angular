import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShareService } from './share.service';

// const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL:any;
  constructor(private http: HttpClient, private shareService: ShareService) { 
    this.API_URL = this.shareService.url + 'api/test';
  }

  getPublicContent(): Observable<any> {
    return this.http.get(this.API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'admin', { responseType: 'text' });
  }
}
