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
import { AdminService } from './../../services/admin.service';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from './../../helpers/must-match.validator';
import { TermBean } from 'src/app/domains/term-bean';


@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
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
 /*  terms= [
    {      
      "term": '1',
      "amount": 19.99,
      "label": "$19.99 for One Year"
    }, {
      "term": '2',
      "amount": 34.99,
      "label": "$34.99 for Two Years"
    }, {
      "term": '3', 	        
      "amount": 54.99,
      "label": "$54.99 for Three Years"
    }, {
      "term": '4', 	    	
      "amount": 69.99,
      "label": "$69.99 for Four Years"
    }
  ]; */
  terms = []
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
              private adminService: AdminService,
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
    this.getTermList();
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

 saveUserProfile() {
  this.userProfileService.saveUserProfile(this.userProfile)
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


getTermList() {

 this.userProfileService.getAllTerms()
      .subscribe(
        (data: TermBean[]) => {
          console.log(data);
          console.log(JSON.stringify(data));
          this.terms = data;
        },
        error => {console.log(error); }
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
