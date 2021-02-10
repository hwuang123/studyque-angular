import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from "rxjs";
import { ShareService } from './../../services/share.service';
import { ChangePassword } from './../../domains/change-password.bean';
import { UserProfileService } from './../../services/user-profile.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  userProfileForm: FormGroup;
  id: number;
  changePassword: ChangePassword = new ChangePassword();

  needLogout: boolean = true;
  submitted = false;
  errorMessage = '';
  message= '';
  hideMessage = true;
  hideErrorMessage = true;
  roles: string[] = [];
  @Output() valueChange  = new EventEmitter();
  unamePattern = "^[a-z0-9_-]{8,15}$";
  pwdPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(private router: Router,
              private shareService: ShareService,
              private userProfileService: UserProfileService) { }

  ngOnInit(): void {
  }
 
   onSubmit(): void{
      this.hideMessage = true;
      console.log(JSON.stringify(this.changePassword));
      this.changePassword.message = '';
      this.changePassword.errorMessage = '';
      this.message = '';
      this.errorMessage = '';
      this.userProfileService.changePassword(this.changePassword)
      .subscribe((data: ChangePassword) => {
        console.log(data);
        if(data.errorMessage){
           this.hideErrorMessage = false;
           this.hideMessage = true;
           this.changePassword.errorMessage = data.errorMessage;
           this.errorMessage = data.errorMessage;
        }
        else{
           this.hideErrorMessage = true;      
           this.changePassword.message = data.message;
           this.message = data.message;
           this.hideMessage = false;
        }
        
      },
       err =>{ 
         console.log(err);
         this.hideErrorMessage = false;
         this.hideMessage = false;
         this.errorMessage = err.message;        
      }
       
       ); 
   }

   cancel(){
      this.changePassword = new ChangePassword();
   }
}
