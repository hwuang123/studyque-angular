import { Component, OnInit,  ViewChild, EventEmitter, Output } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { SES, AWSError } from 'aws-sdk';
import { SendEmailRequest, SendEmailResponse } from 'aws-sdk/clients/ses';
import * as https from 'https';
import { AuthService } from './../services/auth.service';
import { TokenStorageService } from './../services/token-storage.service';
import { ShareService } from './../services/share.service';
import { Email } from './../domains/email.bean';
import { RecaptchaErrorParameters } from "ng-recaptcha";

const AWS = require("aws-sdk");
ses:AWS.SES = new AWS.SES({ region: 'us-east-2'});
const VCODE_KEY= "VCODE";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('f') myForm;
  @Output() valueChange  = new EventEmitter();
  needLogout: boolean = true;
  form: any = {};
  rememberMe: boolean = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  message='';
  roles: string[] = [];
  email: Email = new Email();
  myEmailAddress: string='';
  vCode: string='';
  switchType: string = 'login';
  confirmPassword: string = '';
  isDisabled: boolean = true;
 
  constructor(private router: Router,
              private activeRouter: ActivatedRoute,  
              private authService: AuthService, 
              private tokenStorage: TokenStorageService,
              private shareService: ShareService) { }

  ngOnInit(): void {
    let sType = this.activeRouter.snapshot.queryParamMap.get('switchType');
    if(sType != null){
      this.switchType = sType;
    }
    this.vCode = this.activeRouter.snapshot.queryParamMap.get('verification');
    this.myEmailAddress = this.activeRouter.snapshot.queryParamMap.get('email');
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
    this.message="";
    this.errorMessage="";
    switch (this.switchType) {
      case "login":
        this.login();
        break;
    
      case "forgetname":
        this.sendEmailForgetName();
        break;
      
      case "verifyForgetUserName":
          this.verifyForgetUserName();
          break;

      case "verifyForgetPassword":
          this.verifyForgetPassword();
          break;
      case "resetPassword":
          this.resetPassword();    
          break;
      default:
        this.sendEmailForgetPassword();
    }
    this.isDisabled = true;
   /*  this.shareService.startDisplayLogout();
     this.authService.login(this.form).subscribe(
       data => {
         this.tokenStorage.saveToken(data.accessToken,this.rememberMe);
         this.tokenStorage.saveUser(data,this.rememberMe);
  
         this.isLoginFailed = false;
         this.isLoggedIn = true;
         this.roles = this.tokenStorage.getUser().roles;
         this.shareService.userName = data.username;
         this.shareService.hasAdminRole = this.roles.some(x => x === "ROLE_ADMIN");
         this.shareService.hasDeveloperRole = this.roles.some(x => x === "ROLE_DEVELOPER");
         this.router.navigateByUrl("/addclasses");
       },
       err => {
         this.errorMessage = err.error.message;
         this.isLoginFailed = true;

       }
     ); */
  }

  login(){
    this.shareService.startDisplayLogout();
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken,this.rememberMe);
        this.tokenStorage.saveUser(data,this.rememberMe);
 
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.shareService.userName = data.username;
        this.shareService.hasAdminRole = this.roles.some(x => x === "ROLE_ADMIN");
        this.shareService.hasDeveloperRole = this.roles.some(x => x === "ROLE_DEVELOPER");
        this.router.navigateByUrl("/addclasses");
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;

      }
    );
  }

  // AutoLogin(){
  //   const accessTokenObj = localStorage.getItem("token");
  //   // Retrieve rememberMe value from local storage
  //   const rememberMe = localStorage.getItem('rememberMe');
  //   console.log(accessTokenObj);
  //   if (accessTokenObj && rememberMe == 'yes') {
  //     this.router.navigate(['/addclasses']);
  //   } else {
  //     console.log("You need to login")
  //   }
  //  }

  reloadPage() {
    window.location.reload();
  }

  sendEmail(){
    this.authService.email(this.email).subscribe(
      data => {
        this.isLoginFailed = false;
        this.isLoggedIn = false;
 
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;

      }
    );
  }

 cancel(){
    this.isDisabled = true;
    this.switchType="login";
    this.message='';
    this.errorMessage='';
  }
  
  getVerificationCode(){
    this.authService.getVerificationCode(this.email).subscribe(
      (data: Email) => {
        if(data.errorMessage ==''){
           this.email.verificationCode = data.verificationCode;
           this.message = data.message;
           this.switchType= "verifyForgetUserName";
           window.sessionStorage.setItem(VCODE_KEY, data.verificationCode);
        }
        else{
          this.errorMessage = data.errorMessage;
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;

      }
    );
  }

  sendEmailForgetName(){
  
    // if(this.myEmailAddress == ''){
    //   this.errorMessage="Email is a required field";
    // }
    // else{
    

    this.email.email = this.myEmailAddress;
    this.email.subject = "Forget User Name";
    this.email.body = "";
     this.errorMessage='';
     this.message='';
     this.isLoggedIn = false;
     this.isLoginFailed = false;
     this.authService.forgetUserName(this.email).subscribe(
       (data: Email)  => {
         this.errorMessage = data.errorMessage;
         if(this.errorMessage == ''){
          this.switchType= "verifyForgetUserName";
          window.sessionStorage.removeItem(VCODE_KEY);
          window.sessionStorage.setItem(VCODE_KEY, data.verificationCode);
         }
         this.message = data.message;
       },
       err => {
        this.errorMessage = err.error.message;
        ;
        ;
        this.isLoginFailed = true;
       }
     );
  //  }
  //  this.sendEmail();
  }

  verifyForgetUserName(){
    this.message="";
    this.errorMessage="";
    if(this.vCode !=  window.sessionStorage.getItem(VCODE_KEY)){
      this.errorMessage = "Verification is invalid !";
    }
    else{
         this.email.email = this.myEmailAddress;
         this.email.subject = "Forget User Name";
         this.email.body = "";
         this.email.url = window.location.href;
        // this.email.url = this.shareService.url.slice(0, -13)+'4200/login';
         this.authService.emailUserName(this.email).subscribe(
          (data: Email)  => {
            this.errorMessage = data.errorMessage;
            this.message = data.message;
          },
          err => {
           this.errorMessage = err.error.message;
           this.isLoginFailed = true;
          }
        );
    }
  }

  verifyForgetPassword(){
    this.message="";
    this.errorMessage="";
    if(this.vCode !=  window.sessionStorage.getItem(VCODE_KEY)){
      this.errorMessage = "Verification is invalid !";
    }
    else{
         this.email.email = this.myEmailAddress;
         this.email.subject = "Forget Password";
         this.email.body = "";
         this.email.url = window.location.href+"?switchType=resetPassword&verification="+this.vCode+"&email="+this.myEmailAddress;
        // this.email.url = this.shareService.url.slice(0, -13)+'4200/login';
         this.authService.emailResetPassword(this.email).subscribe(
          (data: Email)  => {
            this.errorMessage = data.errorMessage;
            this.message = data.message;
          },
          err => {
           this.errorMessage = err.error.message;
           this.isLoginFailed = true;
          }
        );
    }
  }

  sendEmailForgetPassword(){
    this.email.email = this.myEmailAddress;
    this.email.username = this.form.username;
    this.email.subject = "Forget Password";
    this.email.body = "";
     this.errorMessage='';
     this.message='';
     this.isLoggedIn = false;
     this.isLoginFailed = false;
     this.authService.sendEmailForgetPassword(this.email).subscribe(
       (data: Email)  => {
         this.errorMessage = data.errorMessage;
         if(this.errorMessage == ''){
          this.switchType= "verifyForgetPassword";
          window.sessionStorage.removeItem(VCODE_KEY);
          window.localStorage.removeItem(VCODE_KEY);
          window.sessionStorage.setItem(VCODE_KEY, data.verificationCode);
          window.localStorage.setItem(VCODE_KEY, data.verificationCode);
         }
         this.message = data.message;
       },
       err => {
        this.errorMessage = err.error.message;
        ;
        ;
        this.isLoginFailed = true;
       }
     );
  }

  resetPassword(){
    if(this.vCode !=  window.localStorage.getItem(VCODE_KEY)){
      this.errorMessage = "Verification Code is invalid";
      return;
    }
    this.email.email = this.myEmailAddress;
    this.email.username = this.form.username;
    this.email.subject = "Reset Password";
    this.email.url = window.location.href;
    this.email.body = "";
     this.errorMessage='';
     this.message='';
     this.isLoggedIn = false;
     this.isLoginFailed = false;
     this.authService.resetPassword(this.email).subscribe(
       (data: Email)  => {
         this.errorMessage = data.errorMessage;
         if(this.errorMessage == ''){
            window.localStorage.removeItem(VCODE_KEY);
         }
         this.message = data.message;
       },
       err => {
        this.errorMessage = err.error.message;
        ;
        ;
        this.isLoginFailed = true;
       }
     );
  }

  clickLogin(){
    this.switchType="login";
  }
  forgetname(){
    this.isDisabled = true;
    this.switchType="forgetname";
  }

  forgetpassword(){
    this.isDisabled = true;
    this.switchType="forgetpassword";
  }
  public resolved(captchaResponse: string): void {
    this.isDisabled = false;
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    this.isDisabled = true;
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }
}
