import { Injectable } from '@angular/core';
import { ShareService } from './share.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private shareService: ShareService) { }

  signOut() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    this.shareService.loginStatus = false;
  }

  public saveToken(token: string, rememberMe: boolean=false) {
    if(rememberMe == true){
       window.localStorage.removeItem(TOKEN_KEY);
       window.localStorage.setItem(TOKEN_KEY, token);
    }
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    this.shareService.loginStatus = true;
  }

  public removeToken(){
    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
    this.shareService.loginStatus = false;
  }

  public getToken(): string {
    let token = localStorage.getItem(TOKEN_KEY);
    if(token){
      return token;
    }
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user, rememberMe: boolean=false) {
    if(rememberMe == true){
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
   }
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser() {
    let user = JSON.parse(localStorage.getItem(USER_KEY));
    if(user){
      return user;
    }
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public removeUser(){
    window.localStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem(USER_KEY);
  }
}
