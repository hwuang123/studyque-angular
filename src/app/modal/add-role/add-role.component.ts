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
import { RoleBean } from './../../domains/role-bean';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ShareService } from './../../services/share.service';
import { CommonFunctionService } from './../../shared/common-function.service';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { AdminService } from './../../services/admin.service'; 

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  hideSucceed = true;
  hideError = true;
  errorMessage = "";
  message = "";
  isUpdate = false;
  isFromCancel = false;
  IsWait=false;
  roleBean: RoleBean =  new RoleBean();
  targetItem: any = "/role";
  @ViewChild('roleForm') roleForm: NgForm;
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
    this.roleBean = this.fromParent;
    this.hideError = true;
    this.IsWait = false;
    if(this.roleBean.pkRoleId > 0){
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
    this.roleBean = new RoleBean();
    this.isUpdate = false;
    this.hideSucceed = true;
    this.hideError = true;
  }

  saveRole() {

    this.IsWait = true;
    this.adminService.createRole(this.roleBean)
      .subscribe((data : RoleBean) => {
        console.log(data);
 
        if(data.pkRoleId > 0){
        this.message = "A New Role Is Saved";       
        this.hideSucceed = false;
        this.hideError = true;
        }
        else{
          this.message = "";
          this.errorMessage = data.description;       
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

  updateRole(){

    this.adminService.updateRole(this.roleBean.pkRoleId,this.roleBean)
    .subscribe((data: RoleBean) => {
      console.log(data);
      if(data.pkRoleId <= 0){
         this.hideError = false;
         this.hideSucceed = true;
         this.errorMessage = data.description;
         this.IsWait = false;
      }
      else{
         this.hideError = true;      
         this.message = "Succeedfully update Role for " + data.roleName;
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
      this.updateRole();
   }
   else{
      this.saveRole();
   }
  }

}
