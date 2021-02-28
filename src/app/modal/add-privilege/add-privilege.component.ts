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
import { PrivilegeBean } from './../../domains/privilege-bean';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ShareService } from './../../services/share.service';
import { CommonFunctionService } from './../../shared/common-function.service';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { AdminService } from './../../services/admin.service'; 

@Component({
  selector: 'app-add-privilege',
  templateUrl: './add-privilege.component.html',
  styleUrls: ['./add-privilege.component.css']
})
export class AddPrivilegeComponent implements OnInit {
  hideSucceed = true;
  hideError = true;
  errorMessage = "";
  message = "";
  isUpdate = false;
  isFromCancel = false;
  IsWait=false;
  privilegeBean: PrivilegeBean =  new PrivilegeBean();
  targetItem: any = "/privilege";
  @ViewChild('privilegeForm') privilegeForm: NgForm;
  @Input() fromParent: any;  

  constructor(@Inject(LOCALE_ID) private locale: string,
  private route: ActivatedRoute,
  public dialog: MatDialog,
  private modalService: NgbModal,
  private adminService: AdminService,
  private router: Router, 
  public activeModal: NgbActiveModal,
  private shareService: ShareService,
  private commonFunctionService: CommonFunctionService) { }

  ngOnInit(): void {
    this.privilegeBean = this.fromParent;
          this.hideError = true;
       this.IsWait = false;
       if(this.privilegeBean.pkPrivilegeId > 0){
         this.isUpdate = true;
       } 
   
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

  cancel(){
    this.privilegeBean = new PrivilegeBean();
    this.isUpdate = false;
    this.hideSucceed = true;
    this.hideError = true;
  }

  savePrivilege() {

    this.IsWait = true;
    this.adminService.createPrivilege(this.privilegeBean)
      .subscribe((data : PrivilegeBean) => {
        console.log(data);
 
        if(data.pkPrivilegeId > 0){
        this.message = "A New Privilege Is Saved";       
        this.hideSucceed = false;
        this.hideError = true;
        }
        else{
          this.message = "";
          this.errorMessage = data.privDesc;       
          this.hideSucceed = true;
          this.hideError = false;
        }
        this.IsWait = false;
       },
       error => {
        this.errorMessage = error.message;
        this.hideError = false;
        this.hideSucceed = true; 
        this.IsWait = false;
        console.log(error);
      });
  }

  updatePrivilege(){

    this.adminService.updatePrivilege(this.privilegeBean.pkPrivilegeId,this.privilegeBean)
    .subscribe((data: PrivilegeBean) => {
      console.log(data);
      if(data.pkPrivilegeId <= 0){
         this.hideError = false;
         this.hideSucceed = true;
         this.errorMessage = data.privDesc;
         this.IsWait = false;
      }
      else{
         this.hideError = true;      
         this.message = "Succeedfully update Privilege for " + data.privName;
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
    if(this.isUpdate){
      this.updatePrivilege();
   }
   else{
      this.savePrivilege();
   }
  }

}
