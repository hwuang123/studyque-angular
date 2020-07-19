import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from "rxjs";
import { Assignment } from './../../domains/assignment';
import { AssignmentType } from './../../domains/assignment-type';
import { ClassName } from './../../domains/class-name';
import { ClassdayOfWeek } from './../../domains/classday-of-week';
import { StudentBean } from './../../domains/student-bean';
import { ShareService } from './../../services/share.service';
import { AddClassService } from './../../services/add-class.service';


@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.component.html',
  styleUrls: ['./add-classes.component.css']
})
export class AddClassesComponent implements OnInit {
  assignment: Assignment;
  assignmentType: AssignmentType;
  className: ClassName;
  classdayOfWeek: ClassdayOfWeek;
  academicTerms = [];
  errorMessage = '';
  message= '';
  hideMessage = true;
  hideErrorMessage = true; 


  constructor(private router: Router,
    private shareService: ShareService,
    private addClassService: AddClassService) { }

  ngOnInit(): void {
    this.assignment = new Assignment();
    this.assignmentType = new AssignmentType();
    this.assignmentType.studernt = new StudentBean();
    this.className = new ClassName();
    this.className.student = new StudentBean();
    this.classdayOfWeek = new ClassdayOfWeek();
    this.classdayOfWeek.classname = this.className;
    this.academicTerms = this.shareService.academicTerms;

  }

  saveClassName(){
    this.addClassService.saveClassName(this.className)
    .subscribe((data: ClassName) => {
      console.log(data);
      if(data.errorMessage){
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.className.errorMessage = data.errorMessage;
         this.errorMessage = data.errorMessage;
      }
      else{
         this.hideErrorMessage = true;      
         this.className.message = data.message;
         this.message = data.message;
         this.hideMessage = false;
      }
      
    },
     err =>{ 
       console.log(err);
       this.hideErrorMessage = false;
       this.hideMessage = false;
       this.errorMessage = err.error.errorMessage;        
    }
     
     ); 
  }

  onSubmit(): void{
  
    this.saveClassName();
 }

}
