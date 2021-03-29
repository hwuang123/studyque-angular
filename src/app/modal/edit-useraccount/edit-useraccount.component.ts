import { Component, OnInit, EventEmitter, Output, LOCALE_ID, Inject, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, NgForm, Validators, FormGroup, FormArray } from '@angular/forms';
import { Observable, BehaviorSubject, ReplaySubject, combineLatest, merge, of  } from "rxjs";
import 'jquery-ui';
import * as $ from 'jquery';
import 'jqueryui';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { UserBean } from './../../domains/user-bean.bean';
import { StatusBean } from './../../domains/status-bean.bean';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ShareService } from './../../services/share.service';
import { CommonFunctionService } from './../../shared/common-function.service';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { AdminService } from './../../services/admin.service'; 

@Component({
  selector: 'app-edit-useraccount',
  templateUrl: './edit-useraccount.component.html',
  styleUrls: ['./edit-useraccount.component.css']
})
export class EditUseraccountComponent implements OnInit {
  hideSucceed = true;
  hideError = true;
  errorMessage = "";
  message = "";
  orgStatusId: number;
  orgExpiredDate: Date;
  isUpdate = false;
  isFromCancel = false;
  IsWait=false;
  statusList: StatusBean [] = []; 
  userBean: UserBean =  new UserBean();
  targetItem: any = "/";
  @ViewChild('userForm') termForm: NgForm;
  @Input() fromParent: any;  
  constructor( @Inject(LOCALE_ID) private locale: string,
  private route: ActivatedRoute,
  public dialog: MatDialog,
  private modalService: NgbModal,
  private adminService: AdminService,
  private router: Router, 
  public activeModal: NgbActiveModal,
  private shareService: ShareService,
  private commonFunctionService: CommonFunctionService) { }

  ngOnInit(): void {
    this.getstatusList();
    this.userBean = this.fromParent;
    this.orgStatusId = this.userBean.pkStatusId;
    this.orgExpiredDate = this.userBean.expiredDate;
    this.hideSucceed = true;
    this.hideError = true;
    this.IsWait = false;
    if(this.userBean.pkUseraccountId > 0){
      this.isUpdate = true;
    } 
//    this.cancel();
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

  getstatusList(){
    this.IsWait=true;
    this.adminService.getAllStatus()
         .subscribe(
           data => {
             console.log(data);
             console.log(JSON.stringify(data));
             this.statusList = data;
             this.IsWait=false;
         
           },
           error => {console.log(error); this.IsWait=false;}
         );
  }

  cancel(){
    this.userBean.pkStatusId = this.orgStatusId;
    this.userBean.expiredDate = this.orgExpiredDate;
    this.isUpdate = false;
    this.hideSucceed = true;
    this.hideError = true;
  }

  updatUser(){
    this.userBean.expiredDate = this.addDays(this.userBean.expiredDate,1);
    this.adminService.editUser(this.userBean.pkUseraccountId,this.userBean)
    .subscribe((data: UserBean) => {
      console.log(data);
      if(data.pkUseraccountId <= 0){
         this.hideError = false;
         this.hideSucceed = true;
         this.errorMessage = data.errorMessage;
         this.IsWait = false;
      }
      else{
         this.hideError = true;      
         this.message = "Succeedfully update user account for  " + data.userName;
         this.hideSucceed = false;
         this.IsWait = false;
      }
      
    },
     err =>{ 
       console.log(err);
       this.hideError = false;
       this.hideSucceed = false;
       this.errorMessage = err.error.errorMessage;        
    }
     
     ); 
     this.isUpdate = false;

}

onSubmit() {
    this.updatUser();
}

addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}

}
