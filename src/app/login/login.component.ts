import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from './../services/auth.service';
import { TokenStorageService } from './../services/token-storage.service';
import { ShareService } from './../services/share.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() valueChange  = new EventEmitter();
  needLogout: boolean = true;
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  
  constructor(private router: Router,
              private authService: AuthService, 
              private tokenStorage: TokenStorageService,
              private shareService: ShareService) { }

  ngOnInit(): void {
     if (this.tokenStorage.getToken()) {
       this.isLoggedIn = true;
       this.roles = this.tokenStorage.getUser().roles;
      }
      this.shareService.startDisplayLogout();
      this.dispalyLogout();
  }

  dispalyLogout(): void{
     this.valueChange.emit(this.needLogout);
  }

  onSubmit() {
    this.shareService.startDisplayLogout();
     this.authService.login(this.form).subscribe(
       data => {
         this.tokenStorage.saveToken(data.accessToken);
         this.tokenStorage.saveUser(data);
  
         this.isLoginFailed = false;
         this.isLoggedIn = true;
         this.roles = this.tokenStorage.getUser().roles;
         this.shareService.userName = data.username;
         //this.reloadPage();
         this.router.navigateByUrl("/addclasses");
       },
       err => {
         this.errorMessage = err.error.message;
         this.isLoginFailed = true;

       }
     );
  }

  reloadPage() {
    window.location.reload();
  }

  forgetname(){

  }

  forgetpassword(){

  }
}
