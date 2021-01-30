import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from "rxjs";
import { ShareService } from './../../services/share.service';
import { UserProfile} from './../../domains/user-profile';
import { StudentBean } from './../../domains/student-bean';
import { SchoolBean } from './../../domains/school-bean';
import { GuardianBean } from './../../domains/guardian-bean';
import { UserProfileService } from './../../services/user-profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfileForm: FormGroup;
  id: number;
  userProfile: UserProfile = new UserProfile();

  selectedSameAddress="Y";
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
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$"; 
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
   
  titleOptions=[];
  genderOptions=[];
  yesOrNoOptions=[];
  relationOptions= [];
  stateOptions = [];
  schoolTypeOptions = [];
            
  constructor(
              // private formBuilder: FormBuilder, 
              private router: Router,
              private shareService: ShareService,
              private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    this.userProfile.orderTerm = '';
    this.userProfile.studentBean = new StudentBean();
    this.userProfile.schoolBean = new SchoolBean();
    this.userProfile.guardianBean = new GuardianBean();
    this.stateOptions = this.shareService.stateOptions;
    this.titleOptions = this.shareService.titleOptions;
    this.genderOptions = this.shareService.genderOptions;
    this.relationOptions = this.shareService.relationOptions;
    this.yesOrNoOptions = this.shareService.yesOrNoOptions;
    this.schoolTypeOptions = this.shareService.schoolTypeOptions;
    this.getUserProfile();
/*     this.userProfileForm = this.formBuilder.group({
      orderTerm: '',
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      studentBean: this.formBuilder.group({
        title: '',
        gender:  ['', Validators.required],
        age:  ['', Validators.required],
        firstName:  ['', Validators.required],
        middleName: '',
        lastName:  ['', Validators.required],
        major: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
        homePhone: string;
        cellPhone: string;
        address: string;
        city: string;
        state: string;
        zip: string;
      })
  }, {
      validator: MustMatch('password', 'confirmPassword')
  }); */
  }

clickGender(selectedValue): void{
  this.userProfile.studentBean.gender = selectedValue;
}

clickGuardianGender(selectedValue): void{
  this.userProfile.guardianBean.gender = selectedValue;
}

 clickSameAddress(selectedValue): void{
   this.userProfile.guardianBean.addressSameAsStudent = selectedValue;
   this.selectedSameAddress = selectedValue;
 }

  dispalyLogout(): void{
    this.valueChange.emit(this.needLogout);
 }

 getUserProfile() {
   this.userProfileService.getUserProfile()
     .subscribe((data: UserProfile) => {
      console.log(data);
      if(data.errorMessage){
        this.hideErrorMessage = false;
        this.hideMessage = true;
        this.userProfile.errorMessage = data.errorMessage;
        this.errorMessage = data.errorMessage;
     }
     else{
        this.hideErrorMessage = true;      
        this.userProfile.message = data.message;
        this.message = data.message;
        this.userProfile = data;
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

 saveUserProfile() {
  this.userProfileService.updateUserProfile(this.userProfile)
    .subscribe((data: UserProfile) => {
      console.log(data);
      if(data.errorMessage){
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.userProfile.errorMessage = data.errorMessage;
         this.errorMessage = data.errorMessage;
      }
      else{
         this.hideErrorMessage = true;      
         this.userProfile.message = data.message;
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

 onSubmit(): void{
    this.hideMessage = true;
    console.log(JSON.stringify(this.userProfile));
    this.userProfile.message = '';
    this.userProfile.errorMessage = '';
    this.message = '';
    this.errorMessage = '';
    this.saveUserProfile();
 }

}
