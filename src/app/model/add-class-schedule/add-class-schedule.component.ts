import { Component, OnInit, Input, Output, EventEmitter,  ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";
import 'jquery-ui';
import * as $ from 'jquery';
import 'jqueryui';
import * as moment from 'moment';
/* import * as $ from 'jquery';
import 'jqueryui'; */

import { FormBuilder, NgForm, Validators, FormArray } from '@angular/forms';

import { ShareService } from './../../services/share.service';
import { ClassdayOfWeek } from './../../domains/classday-of-week';
import { ClassScheduleService } from '../../services/class-schedule.service';
import { CommonFunctionService } from './../../shared/common-function.service';

@Component({
  selector: 'app-add-class-schedule',
  templateUrl: './add-class-schedule.component.html',
  styleUrls: ['./add-class-schedule.component.css']
})
export class AddClassScheduleComponent implements OnInit {
  pkClsnmId: number;
  classdayOfWeek: ClassdayOfWeek;
  submitted = false;
  hideSucceed = true;
  hideError = true;
  errorMessage = "";
  message = "";
  error:any;
  IsWait=false;
  targetItem: any = "/addclasses";
  classdayOfWeeks: Observable<ClassdayOfWeek[]>;
  @ViewChild('scheduleForm') scheduleForm: NgForm;
  @Input() fromParent: any;  
  @Output() childClassdayOfWeekOutput = new EventEmitter<Observable<ClassdayOfWeek[]>>();
  weekDayOptions = [];

  constructor( private route: ActivatedRoute,
              private router: Router, 
              public activeModal: NgbActiveModal,
              private shareService: ShareService,
              private classScheduleService: ClassScheduleService,
              private commonFunctionService: CommonFunctionService) { 
              this.weekDayOptions = shareService.weekDays;

              }

  ngOnInit(): void {
    this.classdayOfWeek = new ClassdayOfWeek();
    this.pkClsnmId = this.fromParent;
    this.classdayOfWeek.pkClsnmId = this.pkClsnmId;
   /*  this.classdayOfWeek.starttime;
    this.classdayOfWeek.endtime; */
    this.hideSucceed = true;
    this.hideError = true;
    this.IsWait = false;

    let now = new Date("25 July 2016");
   
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    let str = hours + ':' + minutes;
    this.classdayOfWeek.starttime = str;
    this.classdayOfWeek.endtime = str;

    this.shareService.currentTargetItem.subscribe( targetItem => this.targetItem = targetItem);
    $(document).ready(function () {
      let modalContent: any = $('.modal-content');
     
      modalContent.draggable({
        handle: '.modal-header',
        revert: true,
        revertDuration: 1400,

      });
    });
  }

  saveClassSchedule() {
    //this.spinnerOverlayService.show("Updating...");
    this.IsWait = true;
    this.classScheduleService.saveClassdayOfWeek(this.classdayOfWeek)
      .subscribe((data : ClassdayOfWeek) => {
        console.log(data);
        //this.activeModal.close();
        this.classdayOfWeeks = this.classScheduleService.getClassdayOfWeekList();
        this.childClassdayOfWeekOutput.emit(this.classdayOfWeeks);
       // this.employee = new Employee();
        this.message = data.message;       
        this.hideSucceed = false;
        this.hideError = true;
        this.IsWait = false;
        //this.spinnerOverlayService.hide();
      //  this.gotoList();
      },
       error => {
        this.errorMessage = error.message;
        this.hideError = false;
        this.hideSucceed = true; 
        this.IsWait = false;
        console.log(error);

      });
    // this.employee = new Employee();
    // this.gotoList();
  }

  validateTimes(){
    let validateInfo = this.commonFunctionService.validateTimeRange(this.classdayOfWeek.starttime,this.classdayOfWeek.endtime);
    
    this.hideError = !validateInfo.error;
    this.errorMessage = validateInfo.errorMessage;
    if(this.hideError != true){
      this.scheduleForm.controls['starttime'].setErrors({ 'incorrect': true});
      this.scheduleForm.controls['endtime'].setErrors({ 'incorrect': true});
    }
    else{
      this.scheduleForm.controls['starttime'].setErrors(null);
      this.scheduleForm.controls['endtime'].setErrors(null);
    }
  
  }

  onSubmit() {
     this.saveClassSchedule();    
  }


  gotoList() {
    //this.router.navigate(['/employees']);
    const nextTarget = this.shareService.targetItem;
    this.router.navigate( [nextTarget]);
  }
}
