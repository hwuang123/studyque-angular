import { Injectable } from '@angular/core';
import { Location } from '@angular/common'; 
import { Subject, BehaviorSubject  } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private location: Location) { }
  private _displayLogout: boolean = false;
  private _loginStatus: boolean = false;
  private _hasAdminRole: boolean = false;
  private _targetItem: any;
  private _username: any;
  private _url: any = 'http://Studyque-env-2.eba-nxupp7m2.us-east-2.elasticbeanstalk.com/';
  displayLogoutStatus: Subject<boolean> = new Subject();
  loginStatusValue: Subject<boolean> = new Subject();
  targetItemValue:  Subject<any> = new Subject();
  userNameValue: Subject<any> = new Subject();
  hasAdminValue: Subject<boolean> = new Subject();
  //private displayLogoutStatus = new BehaviorSubject(this._displayLogout);
  currentDisplayLogoutStatus = this.displayLogoutStatus.asObservable();
  currentLoginStatus = this.loginStatusValue.asObservable();
  currentTargetItem = this.targetItemValue.asObservable();
  currentUserName = this.userNameValue.asObservable();
  currentHasAdminRole = this.hasAdminValue.asObservable();
  _stateOptions= [ 
    { "value": "", "label":"-- choose state --"},      
    { "value": "AL", "label":"Alabama"},
    { "value": "AK", "label":"Alaska"},
    { "value": "AZ", "label":"Arizona"},
    { "value": "AR", "label":"Arkansas"},
    { "value": "CA", "label":"California"},
    { "value": "CO", "label":"Colorado"},
    { "value": "CT", "label":"Connecticut"},
    { "value": "DE", "label":"Delaware"},
    { "value": "DC", "label":"District Of Columbia"},
    { "value": "FL", "label":"Florida"},
    { "value": "GA", "label":"Georgia"},
    { "value": "HI", "label":"Hawaii"},
    { "value": "ID", "label":"Idaho"},
    { "value": "IL", "label":"Illinois"},
    { "value": "IN", "label":"Indiana"},
    { "value": "IA", "label":"Iowa"},
    { "value": "KS", "label":"Kansas"},
    { "value": "KY", "label":"Kentucky"},
    { "value": "LA", "label":"Louisiana"},
    { "value": "ME", "label":"Maine"},
    { "value": "MD", "label":"Maryland"},
    { "value": "MA", "label":"Massachusetts"},
    { "value": "MI", "label":"Michigan"},
    { "value": "MN", "label":"Minnesota"},
    { "value": "MS", "label":"Mississippi"},
    { "value": "MO", "label":"Missouri"},
    { "value": "MT", "label":"Montana"},
    { "value": "NE", "label":"Nebraska"},
    { "value": "NV", "label":"Nevada"},
    { "value": "NH", "label":"New Hampshire"},
    { "value": "NJ", "label":"New Jersey"},
    { "value": "NM", "label":"New Mexico"},
    { "value": "NY", "label":"New York"},
    { "value": "NC", "label":"North Carolina"},
    { "value": "ND", "label":"North Dakota"},
    { "value": "OH", "label":"Ohio"},
    { "value": "OK", "label":"Oklahoma"},
    { "value": "OR", "label":"Oregon"},
    { "value": "PA", "label":"Pennsylvania"},
    { "value": "RI", "label":"Rhode Island"},
    { "value": "SC", "label":"South Carolina"},
    { "value": "SD", "label":"South Dakota"},
    { "value": "TN", "label":"Tennessee"},
    { "value": "TX", "label":"Texas"},
    { "value": "UT", "label":"Utah"},
    { "value": "VT", "label":"Vermont"},
    { "value": "VA", "label":"Virginia"},
    { "value": "WA", "label":"Washington"},
    { "value": "WV", "label":"West Virginia"},
    { "value": "WI", "label":"Wisconsin"},
    { "value": "WY", "label":"Wyoming"}
       ];

      _titleOptions= [{
        "value": "Jr.",
        "label": "Jr."
      },{
        "value": "Sr.",
        "label": "Sr."   	    	
      },{
        "value": "I",
        "label": "I"   	    	
      },{
        "value": "II",
        "label": "II"   	    	
      },{
        "value": "III",
        "label": "III"   	    	
      }];
    
     _genderOptions= [{
        "value": "M",
        "label": "Male"
      },{
        "value": "F",
        "label": "Female"   	    	
      }];

     _relationOptions= [
        {
         "value":"",
         "label":"-- choose relationship --"
        },
        {
             "value": "Parent",
             "label": "Parent"
        },{
           "value": "Grandparent",
           "label": "Grandparent"	    	
        },{
           "value": "OtherGuardian/Family Memeber",
           "label": "OtherGuardian/Family Memeber"
        }
        ];
        
        _schoolTypeOptions= [
          {"value":"",
           "label": "-- choose school type --" },
          {
            "value": "College",
            "label": "College"
          },{
            "value": "Elementry School",
            "label": "Elementry School"   	    	
          },{
            "value": "Middle School",
            "label": "Middle School"   	    		    	
          },{
            "value": "High School",
            "label": "High School"   	    		    	
          },{
            "value": "Mecical School",
            "label": "Mecical School"   	    		    	
          },{
            "value": "Other",
            "label": "Other"   	    		    	
          }
          ];

      _yesOrNoOptions= [{
          "value": "Y",
            "label": "Yes"
          },{
          "value": "N",
          "label": "No"	    	
        }
        ];

       _academic_terms= [
        {
          "value":"",
          "label":"-- Choose Term --"        
         }, 
       {
        "value":"Semester",
        "label":"Semester"        
       },
       {
        "value":"Trimester",
        "label":"Trimester"       
       },
       {
        "value":"Quarter",
        "label":"Quarter"
       }
       ]; 

       _week_days= [
        {
          "value":"",
          "label":"--Choose Day of Week--"        
         }, 
         {
          "value":"Sunday",
          "label":"Sunday"        
         },
         {
          "value":"Monday",
          "label":"Monday"        
         },
         {
          "value":"Tuesday",
          "label":"Tuesday"       
         },
         {
          "value":"Wednesday",
          "label":"Wednesday"
         },
         {
          "value":"Thursday",
          "label":"Thursday"
         },
         {
          "value":"Friday",
          "label":"Friday"
         },
         {
           "value":"Saturday",
           "label":"Saturday"
         }
       ]; 

  get url(): any {
    var hostname: any = this.location['_platformLocation'].hostname;
    if (hostname == 'localhost'){
      this._url = 'http://localhost:5000/RESTful/';
    }
    return this._url;
  }   
      
  get weekDays(): any[] {
    return this._week_days;
  }     
  get schoolTypeOptions(): any[] {
    return this._schoolTypeOptions;
  }

  get academicTerms(): any[] {
     return this._academic_terms;
  }       

  get relationOptions(): any[] {
     return this._relationOptions;
  }   

  get yesOrNoOptions(): any[] {
    return this._yesOrNoOptions;
  }   

  get stateOptions(): any[] {
    return this._stateOptions;
  }   

  get titleOptions(): any[] {
    return this._titleOptions;
  }

  get genderOptions(): any[] {
    return this._genderOptions;
  }

  get targetItem():any {
    return this._targetItem;
  }

  set targetItem(value) {
    this._targetItem = value;
    this.targetItemValue.next(value);
  }

  get userName():any {
    return this._username;
  }

  set userName(value) {
    this._username = value;
    this.userNameValue.next(value);
  }

  get hasAdminRole():boolean {
      return this._hasAdminRole;
  }

  set hasAdminRole(value) {
    this._hasAdminRole = value;
    this.hasAdminValue.next(value);
  }

  get displayLogout():boolean {
    return this._displayLogout;
  }

  set displayLogout(value) {
    this._displayLogout = value;
    this.displayLogoutStatus.next(value);
  }

  get loginStatus(): boolean {
    return this._loginStatus;
  }

  set loginStatus(value) {
    this._loginStatus = value;
    this.loginStatusValue.next(value);
  }

  startDisplayLogout() {
    this._displayLogout = true;
  }

  stopDisplayLogout() {
    this._displayLogout = false;
  }
}
